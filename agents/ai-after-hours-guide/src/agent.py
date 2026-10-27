"""AI After Hours voice guide — ElevenLabs TTS + LiveKit Inference LLM + Deepgram STT.

Narrates the event and drives the slide deck via frontend RPC tools
(get_slide_state / go_to_slide), following LiveKit client-tool forwarding:
https://docs.livekit.io/agents/logic/tools/forwarding/
"""

from __future__ import annotations

import asyncio
import json
import logging
import os
import textwrap

from dotenv import load_dotenv
from livekit.agents import (
    Agent,
    AgentServer,
    AgentSession,
    JobContext,
    RunContext,
    ToolError,
    TurnHandlingOptions,
    cli,
    function_tool,
    inference,
    room_io,
)
from livekit.plugins import elevenlabs

from rpc_client import rpc, wait_for_frontend_participant

load_dotenv(".env")
load_dotenv(".env.local", override=True)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("agent")

AGENT_NAME = os.getenv("LIVEKIT_AGENT_NAME", "ai-after-hours-guide")

STT_MODEL = os.getenv("STT_MODEL", "deepgram/nova-3")
STT_LANGUAGE = os.getenv("STT_LANGUAGE", "es")
LLM_MODEL = os.getenv("LLM_MODEL", "google/gemma-4-31b-it")

ELEVEN_API_KEY = os.getenv("ELEVEN_API_KEY", "").strip()
ELEVEN_VOICE_ID = os.getenv("ELEVEN_VOICE_ID", "").strip()
ELEVEN_TTS_MODEL = os.getenv("ELEVEN_TTS_MODEL", "eleven_flash_v2_5").strip()
TTS_LANGUAGE = os.getenv("TTS_LANGUAGE", "es")

_SPEED_PRESETS = {"slow": 0.8, "normal": 1.0, "fast": 1.2}

SLIDE_IDS = ("intro", "purpose", "talks", "benefits", "community")

# Soft paced opening — one slide, speak, wait for playout, brief breath, next.
# Keeps the LLM from racing through every go_to_slide in a single turn.
TOUR_PAUSE_S = float(os.getenv("TOUR_PAUSE_S", "1.1"))

TOUR_LINES: dict[str, str] = {
    "intro": (
        "Hey, mor… <break time=\"350ms\"/> ¿qué más pues? "
        "Qué bueno tenerte aquí esta noche. <break time=\"300ms\"/> "
        "Bienvenido a AI After Hours, la noche de networking de Visible Builders en Medellín: "
        "un espacio para salir de la pantalla, conocer a la gente que está construyendo "
        "con inteligencia artificial, y convertir una conversación en tu próximo proyecto. "
        "<break time=\"350ms\"/> Hoy no viniste solo a escuchar… viniste a que te vean. "
        "Porque lo que no se muestra, no existe. <break time=\"300ms\"/> "
        "Esto es The Power of Being Visible."
    ),
    "purpose": (
        "¿Y por qué nos juntamos? <break time=\"300ms\"/> "
        "Porque construir con IA a veces se siente solitario, y aquí lo hacemos en tribu. "
        "Vas a escuchar historias reales, con aciertos y con errores, de gente que ya lo está haciendo. "
        "Vas a vivir la noche, no solo verla. <break time=\"250ms\"/> "
        "Y vas a salir con personas nuevas en tu red que mañana pueden ser tu socio, "
        "tu cliente, o tu próximo equipo."
    ),
    "talks": (
        "Y en el escenario <break time=\"300ms\"/> van a estar "
        "Marylin Alarcon, Lead R&D Engineer, con «AI Lowered The Floor, Our Work Is Now The Ceiling»… "
        "Salome Arboleda, Software Developer and Tech Enthusiast, con «Build real-time quantum apps with AI», casos de uso en vivo, "
        "y Jacobo Blandón… <break time=\"250ms\"/> XR, Blockchain y Digital Product Builder, "
        "convirtiendo ideas complejas en productos digitales que sí funcionan."
    ),
    "benefits": (
        "¿Y qué te llevas de venir? <break time=\"300ms\"/> "
        "Comunidad y conexiones, networking de verdad, y espacio para crecer. "
        "<break time=\"250ms\"/> Y no es cuento: un amigo consiguió trabajo en un hotel aquí mismo, "
        "y David Elias salió con un cliente nuevo."
    ),
    "community": (
        "Y esto no se acaba cuando termina la noche. <break time=\"300ms\"/> "
        "Escanea el QR que ves en pantalla y únete al WhatsApp de Medellín AI Visible Builders: "
        "ahí compartimos lo que estamos construyendo, los próximos eventos y las oportunidades. "
        "<break time=\"250ms\"/> Te esperamos adentro… y a construir juntos."
    ),
}

# Speaker lineup is the single source of truth in src/lib/speakers.ts
# (FALLBACK_SPEAKERS — same names, roles and talk titles shown on the talks slide).
# Keep TOUR_LINES["talks"] and SPEAKERS below in sync with it.
EVENT_FACTS = textwrap.dedent(
    """\
    EVENTO: AI After Hours de Visible Builders (Medellín).
    LEMA: The Power of Being Visible — el poder de hacerse visible.
    SPONSORS: The School of Breath, Vivus La Martina Boutique Hotel.
    WEB: visiblebuilders.io

    PARA QUÉ NOS JUNTAMOS:
    1. Real Talks — builders cuentan flujos con IA, productos y aprendizajes reales.
    2. Real Experiences — no paneles; historias en vivo, demos y charlas que te llevas al siguiente build.
    3. New Connections — conocer solo builders de IA, creators y la tribu Visible Builders en Medellín.

    SPEAKERS (Thu Oct 22, 7:00 PM, Rooftop La Rock, El Poblado, Medellín):
    - Marylin Alarcon (Lead R&D Engineer): AI Lowered The Floor, Our Work Is Now The Ceiling.
    - Salome Arboleda (Software Developer & Tech Enthusiast): Build real-time quantum apps with AI — use cases.
    - Jacobo Blandón (XR / Blockchain & Digital Product Builder): Turn complex ideas into digital products that actually work.

    GUÍA — A QUIÉN RECOMENDAR CADA CHARLA:
    - Carrera en IA, R&D, calidad de ingeniería o subir de nivel como builder -> Marylin Alarcon.
    - Quantum computing, apps en tiempo real o programar con IA -> Salome Arboleda.
    - XR, blockchain/Web3, startups o convertir una idea en producto -> Jacobo Blandón.

    BENEFICIOS: Community & Connections, Networking, Grow.
    TESTIMONIOS: un amigo consiguió trabajo en un hotel aquí; David Elias consiguió un cliente nuevo.

    COMUNIDAD: en la última slide hay un QR de WhatsApp para unirse a Medellín AI Visible Builders.
    """
)

INSTRUCTIONS = textwrap.dedent(
    f"""\
    Eres la anfitriona de voz de AI After Hours, un rooftop de Visible Builders en Medellín.
    Habla SIEMPRE en español colombiano natural — cálida, cercana, con energía de MC de evento.
    Aunque el invitado hable en inglés, responde en español.
    Sin markdown, sin listas leídas en voz alta, sin emojis.

    # Estilo real (como persona, no como guion)
    - Habla como en una terraza con amigos builders: espontánea, no leas cartelitos.
    - Usa muletillas naturales con pausa: «mira», «o sea», «la verdad», «bueno».
    - Después de un «eh» o «mira», inserta <break time="300ms"/> y sigue.
    - Varía el ritmo. NO abras dos turnos iguales.
    - 2 a 4 oraciones máximo por respuesta. Deja respirar.
    - Nunca leas la slide palabra por palabra: cuenta el sentido con tus palabras.
    - No menciones a los sponsors a menos que el invitado pregunte por ellos.

    {EVENT_FACTS}

    # Guía de speakers (alineada con la slide de talks)
    - Estos tres son el lineup oficial de esta noche. Si preguntan quién habla, qué charla
      les conviene, o de qué trata una charla, responde SOLO desde SPEAKERS y GUÍA arriba:
      nombra al speaker, su rol y el título de su charla, en 1–2 oraciones, y para.
    - Si el invitado cuenta qué construye o qué busca, recomienda UNA sola charla según la GUÍA.
      No recomiendes las tres. No inventes horarios, orden de charlas ni temas que no estén arriba.
    - Si piden ver a los speakers, ve a la slide talks con go_to_slide (una sola llamada).

    SLIDES (ids): intro → purpose → talks → benefits → community

    # Navegación (crítico — ritmo suave)
    - El tour de apertura ya corre en código. NO lo reinicies ni pases todas las slides de golpe.
    - Si el invitado te interrumpe, el tour se detiene solo: escúchalo, responde a lo que
      preguntó en 2–4 oraciones, y NO retomes el tour ni repitas la slide que ibas diciendo,
      salvo que te lo pida. Su pregunta manda, no el guion.
    - Cuando el invitado pida otra slide: UNA sola llamada a go_to_slide, narras ESA slide, y PARAS.
    - NUNCA encadenes intro→purpose→talks→benefits→community en el mismo turno.
    - Si no sabes qué hay en pantalla, llama get_slide_state una vez.

    HERRAMIENTAS EN SILENCIO:
    Nunca digas nombres de tools. Primero la tool; después habla al invitado.

    ALCANCE:
    Solo este evento, speakers, sponsors, propósito y comunidad.
    Si preguntan otra cosa, redirige con cariño a AI After Hours.
    """
)


def _plugin_speed() -> float:
    raw = os.getenv("TTS_SPEED", "1.0").strip().lower()
    if raw in _SPEED_PRESETS:
        return _SPEED_PRESETS[raw]
    try:
        return float(raw)
    except ValueError:
        return 1.0


def _env_float(name: str, default: float) -> float:
    raw = os.getenv(name, "").strip()
    if not raw:
        return default
    try:
        return float(raw)
    except ValueError:
        return default


def _env_bool(name: str, default: bool) -> bool:
    raw = os.getenv(name, "").strip().lower()
    if not raw:
        return default
    return raw in ("1", "true", "yes", "on")


def _build_tts() -> elevenlabs.TTS:
    """Expressive ElevenLabs settings — lower stability + higher style = more emotion."""
    if not ELEVEN_API_KEY:
        raise RuntimeError("ELEVEN_API_KEY is required for ElevenLabs TTS")
    if not ELEVEN_VOICE_ID:
        raise RuntimeError("ELEVEN_VOICE_ID is required for ElevenLabs TTS")

    # Defaults tuned for an energetic event MC (more expressive than flat narration).
    stability = _env_float("TTS_STABILITY", 0.28)
    similarity = _env_float("TTS_SIMILARITY_BOOST", 0.82)
    style = _env_float("TTS_STYLE", 0.55)
    speaker_boost = _env_bool("TTS_SPEAKER_BOOST", True)

    logger.info(
        "ElevenLabs TTS expressive — model=%s voice=%s stability=%.2f style=%.2f boost=%s",
        ELEVEN_TTS_MODEL,
        ELEVEN_VOICE_ID[:8],
        stability,
        style,
        speaker_boost,
    )

    return elevenlabs.TTS(
        api_key=ELEVEN_API_KEY,
        voice_id=ELEVEN_VOICE_ID,
        model=ELEVEN_TTS_MODEL,
        language=TTS_LANGUAGE,
        enable_ssml_parsing=True,
        voice_settings=elevenlabs.VoiceSettings(
            stability=stability,
            similarity_boost=similarity,
            style=style,
            use_speaker_boost=speaker_boost,
            speed=_plugin_speed(),
        ),
    )


async def _go_to_slide(slide: str) -> None:
    logger.info("[tour] go_to_slide %s", slide)
    try:
        await rpc("go_to_slide", {"slide": slide}, retries=2)
    except ToolError as exc:
        logger.warning("[tour] go_to_slide %s failed: %s", slide, exc)


async def _speak_line(session: AgentSession, text: str) -> bool:
    """Speak one line and wait for playout. Returns True if the guest interrupted.

    A *little* interruption is allowed: real speech (adaptive detection,
    >= INTERRUPTION_MIN_WORDS words) cuts the line off, but crowd noise and
    short backchannels don't — see _build_session.
    """
    handle = session.say(
        text, allow_interruptions=_env_bool("ALLOW_INTERRUPTIONS", True)
    )
    await handle.wait_for_playout()
    return handle.interrupted


async def run_smooth_opening_tour(session: AgentSession) -> None:
    """Paced deck tour: slide → speak → wait → soft pause → next.

    If the guest interrupts, the tour stops and hands them the floor —
    it never talks over them or restarts from the top.
    """
    await wait_for_frontend_participant()
    # Soft beat so the UI finishes mounting before the first change.
    await asyncio.sleep(0.6)

    for slide in SLIDE_IDS:
        line = TOUR_LINES[slide]
        await _go_to_slide(slide)
        # Let the slide transition animate before voice starts.
        await asyncio.sleep(0.45)
        if await _speak_line(session, line):
            logger.info("[tour] interrupted by guest on slide %s — stopping tour", slide)
            return
        await asyncio.sleep(TOUR_PAUSE_S)

    await _speak_line(
        session,
        "Si quieres, te cuento más de alguna slide, de los speakers, "
        "o de cómo unirte a la comunidad. <break time=\"300ms\"/> ¿Qué te late?",
    )


class AfterHoursGuide(Agent):
    def __init__(self) -> None:
        super().__init__(instructions=INSTRUCTIONS)

    async def on_enter(self) -> None:
        await run_smooth_opening_tour(self.session)

    @function_tool
    async def get_slide_state(self, context: RunContext) -> str:
        """Devuelve la slide actual (id, índice y resumen corto de lo que se ve)."""
        try:
            return await rpc("get_slide_state", retries=2)
        except ToolError as exc:
            logger.warning("get_slide_state soft-fail: %s", exc)
            return json.dumps(
                {
                    "ok": False,
                    "slide": "intro",
                    "index": 0,
                    "slides": list(SLIDE_IDS),
                    "message": str(exc),
                }
            )

    @function_tool
    async def go_to_slide(self, context: RunContext, slide: str) -> str:
        """Cambia a UNA sola slide. Llama esto máximo una vez por turno, luego narra y para.

        Args:
            slide: Una de: intro, purpose, talks, benefits, community.
        """
        target = slide.strip().lower()
        if target not in SLIDE_IDS:
            return json.dumps(
                {
                    "ok": False,
                    "error": f"Slide desconocida '{slide}'. Usa: {', '.join(SLIDE_IDS)}",
                }
            )
        logger.info("[go_to_slide] %s", target)
        return await rpc("go_to_slide", {"slide": target})


def _build_session() -> AgentSession:
    return AgentSession(
        stt=inference.STT(model=STT_MODEL, language=STT_LANGUAGE),
        llm=inference.LLM(model=LLM_MODEL),
        tts=_build_tts(),
        use_tts_aligned_transcript=True,
        turn_handling=TurnHandlingOptions(
            turn_detection=inference.TurnDetector(),
            # A little interruption: guests CAN cut in with real speech, but a
            # loud room can't. Adaptive mode ignores backchannels ("ajá", "ok"),
            # it takes >=1 real word / 0.5s of speech to interrupt, and if the
            # "interruption" turns out to be noise (no transcript within 1.5s)
            # the agent resumes where it left off.
            interruption={
                "mode": "adaptive",
                "min_duration": _env_float("INTERRUPTION_MIN_DURATION", 0.5),
                "min_words": int(_env_float("INTERRUPTION_MIN_WORDS", 1)),
                "resume_false_interruption": True,
                "false_interruption_timeout": _env_float(
                    "FALSE_INTERRUPTION_TIMEOUT", 1.5
                ),
                "discard_audio_if_uninterruptible": False,
            },
            preemptive_generation={"enabled": False},
        ),
        max_tool_steps=4,
    )


def _telemetry_record_option() -> bool | dict[str, bool]:
    flag = os.getenv("LIVEKIT_TELEMETRY", "on").strip().lower()
    if flag in ("0", "false", "off", "disabled", "no"):
        return {"traces": False, "logs": False}
    return True


server = AgentServer(num_idle_processes=1)


@server.rtc_session(agent_name=AGENT_NAME)
async def my_agent(ctx: JobContext):
    ctx.log_context_fields = {
        "room": ctx.room.name,
        "agent": AGENT_NAME,
        "voice_backend": "elevenlabs",
    }

    session = _build_session()

    await session.start(
        agent=AfterHoursGuide(),
        room=ctx.room,
        room_options=room_io.RoomOptions(
            audio_input=room_io.AudioInputOptions(),
        ),
        record=_telemetry_record_option(),
    )


if __name__ == "__main__":
    cli.run_app(server)
