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

SLIDE_IDS = ("intro", "purpose", "talks", "community")

# Soft paced opening — one slide, speak, wait for playout, brief breath, next.
# Keeps the LLM from racing through every go_to_slide in a single turn.
TOUR_PAUSE_S = float(os.getenv("TOUR_PAUSE_S", "1.1"))

TOUR_LINES: dict[str, str] = {
    "intro": (
        "Mira <break time=\"400ms\"/> qué bueno que llegaste. "
        "Esto es AI After Hours, el rooftop de Visible Builders aquí en Medellín. "
        "The Power of Being Visible… <break time=\"300ms\"/> "
        "y gracias a The School of Breath y a Vivus La Martina por hacer posible esta noche."
    ),
    "purpose": (
        "Bueno <break time=\"300ms\"/> ¿para qué nos juntamos? "
        "Real Talks: builders contando flujos reales con IA. "
        "Real Experiences: historias en vivo, no paneles aburridos. "
        "Y New Connections… <break time=\"250ms\"/> conocer la tribu Visible Builders en Medellín."
    ),
    "talks": (
        "Y en el escenario <break time=\"300ms\"/> van a estar "
        "Oscar Barajas con legal tech e IA, "
        "Jennifer Salazar Duke con su workflow para construir mejor, "
        "y Hector Cantillo… <break time=\"250ms\"/> de consumidor a creator."
    ),
    "community": (
        "Listo <break time=\"300ms\"/> si quieres seguir la conversación después, "
        "en esta slide está el QR de WhatsApp de Medellín AI Visible Builders. "
        "Escanealo cuando quieras y te unes al build."
    ),
}

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

    SPEAKERS:
    - Oscar Barajas (GNDX): AI-Powered Legal Tech — cómo la IA está transformando el sector legal.
    - Jennifer Salazar Duke: My AI Workflow — cómo usa IA para construir mejores proyectos.
    - Hector Cantillo: From Consumer to Creator — la gran oportunidad de crear con IA.

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

    {EVENT_FACTS}

    SLIDES (ids): intro → purpose → talks → community

    # Navegación (crítico — ritmo suave)
    - El tour de apertura ya corre en código. NO lo reinicies ni pases todas las slides de golpe.
    - Cuando el invitado pida otra slide: UNA sola llamada a go_to_slide, narras ESA slide, y PARAS.
    - NUNCA encadenes intro→purpose→talks→community en el mismo turno.
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


async def _speak_line(session: AgentSession, text: str) -> None:
    """Speak one line and wait until audio finishes — no interruptions mid-opening."""
    handle = session.say(text, allow_interruptions=False)
    await handle.wait_for_playout()


async def run_smooth_opening_tour(session: AgentSession) -> None:
    """Paced deck tour: slide → speak → wait → soft pause → next."""
    await wait_for_frontend_participant()
    # Soft beat so the UI finishes mounting before the first change.
    await asyncio.sleep(0.6)

    for slide in SLIDE_IDS:
        line = TOUR_LINES[slide]
        await _go_to_slide(slide)
        # Let the slide transition animate before voice starts.
        await asyncio.sleep(0.45)
        await _speak_line(session, line)
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
            slide: Una de: intro, purpose, talks, community.
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
            interruption={"resume_false_interruption": False},
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
