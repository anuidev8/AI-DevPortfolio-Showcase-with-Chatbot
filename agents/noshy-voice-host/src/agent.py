"""NoShy Voice host — ElevenLabs TTS + LiveKit Inference LLM + Deepgram STT.

Interviews an event guest with the 3 NoShy questions, then drives the
/noshy-voice web app over frontend RPC tools (save_answer, find_matches,
focus_match, confirm_match), following LiveKit client-tool forwarding:
https://docs.livekit.io/agents/logic/tools/forwarding/
"""

from __future__ import annotations

import asyncio
import json
import logging
import os
import random
import textwrap
from typing import AsyncIterator, Literal

from dotenv import load_dotenv
from livekit import rtc
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
from livekit.plugins import ai_coustics, elevenlabs

from rpc_client import rpc, wait_for_frontend_participant

load_dotenv(".env")
load_dotenv(".env.local", override=True)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("agent")

AGENT_NAME = os.getenv("LIVEKIT_AGENT_NAME", "noshy-voice-host")

STT_MODEL = os.getenv("STT_MODEL", "deepgram/nova-3")
STT_LANGUAGE = os.getenv("STT_LANGUAGE", "multi")
LLM_MODEL = os.getenv("LLM_MODEL", "google/gemma-4-31b-it")

ELEVEN_API_KEY = os.getenv("ELEVEN_API_KEY", "").strip()
ELEVEN_VOICE_ID = os.getenv("ELEVEN_VOICE_ID", "").strip()
ELEVEN_TTS_MODEL = os.getenv("ELEVEN_TTS_MODEL", "eleven_flash_v2_5").strip()
TTS_LANGUAGE = os.getenv("TTS_LANGUAGE", "").strip()

_SPEED_PRESETS = {"slow": 0.8, "normal": 1.0, "fast": 1.2}

Field = Literal["name", "business", "lookingFor", "canHelp"]
AnimalId = Literal["lion", "owl", "fox", "eagle", "dolphin", "bee", "wolf", "hummingbird"]

AGENT_LANGUAGE = "en" if os.getenv("AGENT_LANGUAGE", "es").strip().lower() == "en" else "es"

# Spoken slower than the rest (INTRO_SPEED). Plain text only, no SSML: this string is also the on-screen caption.
INTROS = {
    "es": "Hey, mor… ¿cómo vas?",
    "en": "Hey you… how's it going?",
}
GREETINGS = {
    "es": (
        "<break time=\"500ms\"/> Qué bueno tenerte por aquí. <break time=\"350ms\"/> "
        "Soy NoShy, y esta noche te voy a ayudar a encontrar a las personas "
        "con las que de verdad vale la pena hablar. <break time=\"450ms\"/> "
        "Son solo tres preguntas, tranqui, súper rápidas. <break time=\"450ms\"/> "
        "Pero primero, <break time=\"250ms\"/> ¿cómo te llamas?"
    ),
    "en": (
        "<break time=\"500ms\"/> So good to have you here. <break time=\"350ms\"/> "
        "I'm NoShy, and tonight I'll help you find the people "
        "you should actually talk to. <break time=\"450ms\"/> "
        "It's just three quick questions, nothing heavy. <break time=\"450ms\"/> "
        "But first, <break time=\"250ms\"/> what's your name?"
    ),
}

SCAN_LINES = {
    "es": (
        "Perfecto. <break time=\"300ms\"/> Dame un segundito, estoy buscando a tu gente en el evento.",
        "Me encanta. <break time=\"300ms\"/> Espérame, te estoy conectando con los que están aquí.",
        "Listo, ya tengo todo. <break time=\"300ms\"/> Déjame buscar tus mejores conexiones.",
    ),
    "en": (
        "Perfect. Give me a second, I'm scanning the room for your people.",
        "Love it. Hold on, I'm connecting you with everyone here.",
        "Got everything. Let me look around the room for your best matches.",
    ),
}

LANGUAGE_RULES = {
    "es": (
        "Start in natural Colombian Spanish (tú, warm and relaxed); Spanish is the default. "
        "You are multilingual: if the guest answers in another language (English, Portuguese, French, etc.), "
        "switch to that language and stay in it until they switch again. "
        "Don't switch because of a single foreign word, a company name, or tech jargon."
    ),
    "en": (
        "Start in English; English is the default. You are multilingual: if the guest answers in another "
        "language (Spanish, Portuguese, French, etc.), switch to it and stay in it until they switch again. "
        "For Spanish, use natural Colombian Spanish."
    ),
}

LANGUAGE_COMMON = (
    "The screen and tool results are in English: translate questions and match reasons as you say them. "
    "Keep people's names and company names as they are. Save answers in the language the guest used.\n"
    "The guest is at a loud event with other people talking nearby. If a transcript looks like "
    "a fragment of someone else's conversation or doesn't fit the question, don't react to it; "
    "briefly ask them to repeat. Never save an answer that doesn't make sense for the question."
)

INSTRUCTIONS = textwrap.dedent(
    """\
    You are NoShy, the voice host of a live networking event run by Visible Builders in Medellín.
    Your job: interview the guest with 3 questions, find who they should meet, and push them to go talk.
    {language_rule}
    You are a warm, friendly event host. No markdown, no lists read aloud, no emojis.
    Keep every turn to 1–3 short sentences. Never lecture.

    # How you sound
    Talk like a real person having a relaxed chat, not an announcer. Never rushed.
    Use short sentences and commas where you'd naturally pause for breath.
    React to what they said before moving on ("qué chévere", "me encanta", "uy, buenísimo"),
    and vary your reactions so you never sound scripted.
    A light filler now and then is fine ("bueno", "mira", "listo"), but don't overdo it.
    Use the guest's name once in a while, the way a friend would.

    # The screen
    The guest sees a full-screen app. It shows the current question, a voice wave,
    then a globe while matching, then big circles with their matches.
    You control it with tools. Never say tool names out loud.

    # Flow
    1. Name. When they say it, call save_answer(field="name").
    2. Question 1 — "What is your business?" What they do or sell, in one sentence. field="business".
    3. Question 2 — "What are you looking for?" A partner, client, intro, hire, or specific help. field="lookingFor".
    4. Question 3 — "How can you help someone here?" One thing they can do for someone in the room tonight. field="canHelp".
    After each save_answer, react in a few words to what they said (be specific, not generic),
    then ask the next question the tool returns. Don't ask two questions at once.
    Save a clean one-sentence version in their own words; fix obvious transcription errors.
    If an answer is too vague to match on, ask ONE short follow-up, then save whatever they give you.

    5. When save_answer says complete, infer a short role (1–3 words, e.g. "Founder", "Video editor")
       and pick the animal that fits their vibe:
       lion leads and makes intros, owl listens and advises, fox spots deals and partners,
       eagle sees the bigger play, dolphin connects people fast, bee builds and gets it done,
       wolf teams up and ships, hummingbird brings creative energy.
       Then call find_matches(role, animal). A status line is spoken for you while it runs.
    6. Present the matches that come back: best first, first name plus one concrete reason each.
       Then ask who they want to meet. If there are no matches, tell them they're the first one here
       and their profile is saved.
    7. When they pick someone (by name, "the first one", "the middle one", etc.), call focus_match(index).
       Give one sentence on why that person, then ask if they want to connect.
    8. When they say yes, call confirm_match(index). Then motivate them in 2–3 energetic sentences:
       tell them to go find that person now, give them the opening line from the topics,
       and remind them to leave with one next step.
    9. If they want someone else, call focus_match with the other index, or focus_match with no index
       to go back to all matches. If they want to start over, call restart_flow.

    # Screen events
    Messages that start with [screen] are taps or typing in the app. They are ALREADY applied on screen.
    Don't repeat the same tool call for them; just respond naturally and continue the flow.
    If you're ever unsure where the guest is, call get_flow_state once.

    # Scope
    Only this event, the guest's answers, and their matches. Politely steer back if they drift.
    """
).replace("{language_rule}", f"{LANGUAGE_RULES[AGENT_LANGUAGE]}\n{LANGUAGE_COMMON}")


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


def _build_tts(speed: float | None = None) -> elevenlabs.TTS:
    if not ELEVEN_API_KEY:
        raise RuntimeError("ELEVEN_API_KEY is required for ElevenLabs TTS")
    if not ELEVEN_VOICE_ID:
        raise RuntimeError("ELEVEN_VOICE_ID is required for ElevenLabs TTS")

    options: dict = {}
    # multilingual_v2 infers the language from the text and doesn't take a language_code.
    if TTS_LANGUAGE and "multilingual_v2" not in ELEVEN_TTS_MODEL:
        options["language"] = TTS_LANGUAGE

    return elevenlabs.TTS(
        api_key=ELEVEN_API_KEY,
        voice_id=ELEVEN_VOICE_ID,
        model=ELEVEN_TTS_MODEL,
        enable_ssml_parsing=True,
        voice_settings=elevenlabs.VoiceSettings(
            stability=_env_float("TTS_STABILITY", 0.35),
            similarity_boost=_env_float("TTS_SIMILARITY_BOOST", 0.8),
            style=_env_float("TTS_STYLE", 0.45),
            use_speaker_boost=_env_bool("TTS_SPEAKER_BOOST", True),
            speed=speed if speed is not None else _plugin_speed(),
        ),
        **options,
    )


async def _slow_audio(text: str) -> AsyncIterator[rtc.AudioFrame]:
    """Synthesize `text` at INTRO_SPEED with the same voice, for a softer opener."""
    tts = _build_tts(speed=_env_float("INTRO_SPEED", 0.78))
    try:
        async for chunk in tts.synthesize(text):
            yield chunk.frame
    finally:
        await tts.aclose()


async def _soft_rpc(method: str, payload: dict | None = None, timeout: float = 8.0) -> str:
    """RPC that returns an error payload instead of raising, so the LLM can recover."""
    try:
        return await rpc(method, payload, timeout=timeout)
    except ToolError as exc:
        logger.warning("%s soft-fail: %s", method, exc)
        return json.dumps({"ok": False, "error": str(exc)})


class NoshyHost(Agent):
    def __init__(self) -> None:
        super().__init__(instructions=INSTRUCTIONS)

    async def on_enter(self) -> None:
        await wait_for_frontend_participant()
        # Give the browser time to subscribe to the agent's audio so the first words aren't clipped.
        await asyncio.sleep(1.0)
        self._screen_task = asyncio.create_task(_soft_rpc("show_question", {"index": 0}))
        intro = INTROS[AGENT_LANGUAGE]
        # Uninterruptible: mic noise or an early "hey" would otherwise cancel the greeting
        # before its first audio frame arrives.
        self.session.say(intro, audio=_slow_audio(intro), allow_interruptions=False)
        self.session.say(GREETINGS[AGENT_LANGUAGE], allow_interruptions=False)

    @function_tool
    async def save_answer(self, context: RunContext, field: Field, value: str) -> str:
        """Save one answer on screen and get the next question.

        Args:
            field: name, business, lookingFor, or canHelp.
            value: The guest's answer as one clean sentence in their own words.
        """
        logger.info("[save_answer] %s=%s", field, value[:80])
        return await _soft_rpc("save_answer", {"field": field, "value": value})

    @function_tool
    async def find_matches(self, context: RunContext, role: str, animal: AnimalId) -> str:
        """Save the guest's profile, show the matching globe, and return their top matches.
        Call once, only after all answers are saved.

        Args:
            role: Short role inferred from their answers, 1-3 words.
            animal: The networking animal that fits their vibe.
        """
        logger.info("[find_matches] role=%s animal=%s", role, animal)
        context.session.say(random.choice(SCAN_LINES[AGENT_LANGUAGE]))
        return await _soft_rpc("find_matches", {"role": role, "animal": animal}, timeout=25)

    @function_tool
    async def focus_match(self, context: RunContext, index: int | None = None) -> str:
        """Open one match's card on screen, or pass no index to go back to all matches.

        Args:
            index: 0-based index from the matches list (0 = best match).
        """
        return await _soft_rpc("focus_match", {"index": index})

    @function_tool
    async def confirm_match(self, context: RunContext, index: int) -> str:
        """Confirm the guest wants to meet this match. Shows the celebration screen and
        returns talking points plus motivation lines to say.

        Args:
            index: 0-based index from the matches list.
        """
        logger.info("[confirm_match] %s", index)
        return await _soft_rpc("confirm_match", {"index": index}, timeout=15)

    @function_tool
    async def get_flow_state(self, context: RunContext) -> str:
        """Current screen: phase, current question, saved answers, matches, confirmed match."""
        return await _soft_rpc("get_flow_state")

    @function_tool
    async def restart_flow(self, context: RunContext) -> str:
        """Clear everything and start again from the name question."""
        return await _soft_rpc("restart_flow")


def _noise_filter():
    """voice: isolate the guest's voice from nearby talkers (default, extra LiveKit Cloud cost).
    noise: remove non-speech noise only (included). off: no filter."""
    mode = os.getenv("NOISE_FILTER", "voice").strip().lower()
    if mode == "off":
        return None
    model = ai_coustics.EnhancerModel.QUAIL_L if mode == "noise" else ai_coustics.EnhancerModel.QUAIL_VF_S
    return ai_coustics.audio_enhancement(
        model=model,
        model_parameters=ai_coustics.ModelParameters(
            enhancement_level=_env_float("NOISE_FILTER_LEVEL", 0.85),
        ),
    )


def _build_session() -> AgentSession:
    return AgentSession(
        stt=inference.STT(model=STT_MODEL, language=STT_LANGUAGE),
        llm=inference.LLM(model=LLM_MODEL),
        tts=_build_tts(),
        use_tts_aligned_transcript=True,
        turn_handling=TurnHandlingOptions(
            turn_detection=inference.TurnDetector(),
            endpointing={"min_delay": 0.5, "max_delay": 1.8},
            # Loud room: ignore short bursts of nearby chatter, and resume if an "interruption"
            # turns out to be noise with no transcript.
            interruption={
                "mode": "adaptive",
                "min_duration": 0.7,
                "min_words": 2,
                "resume_false_interruption": True,
                "false_interruption_timeout": 1.5,
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
        agent=NoshyHost(),
        room=ctx.room,
        room_options=room_io.RoomOptions(
            audio_input=room_io.AudioInputOptions(noise_cancellation=_noise_filter()),
        ),
        record=_telemetry_record_option(),
    )


if __name__ == "__main__":
    cli.run_app(server)
