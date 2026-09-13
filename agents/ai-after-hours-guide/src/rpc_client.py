"""LiveKit RPC helpers for the AI After Hours slide deck."""

from __future__ import annotations

import asyncio
import json
import logging
import os
import time

from livekit.agents import ToolError, get_job_context

logger = logging.getLogger("agent.rpc")

PARTICIPANT_WAIT_SECONDS = float(os.getenv("PARTICIPANT_WAIT_SECONDS", "12"))


async def wait_for_frontend_participant(timeout: float | None = None) -> bool:
    """Wait until the browser joins the room (needed before RPC tools)."""
    wait_s = timeout if timeout is not None else PARTICIPANT_WAIT_SECONDS
    room = get_job_context().room
    deadline = time.monotonic() + wait_s
    while time.monotonic() < deadline:
        participant = next(iter(room.remote_participants.values()), None)
        if participant is not None:
            logger.info("Frontend participant ready: %s", participant.identity)
            return True
        await asyncio.sleep(0.15)
    logger.warning("Frontend participant not in room after %.1fs", wait_s)
    return False


async def rpc(
    method: str,
    payload: dict | None = None,
    timeout: float = 8.0,
    retries: int = 2,
) -> str:
    """Call a client tool registered by the Next.js slide deck."""
    last_error: Exception | None = None

    for attempt in range(retries + 1):
        try:
            room = get_job_context().room
            participant = next(iter(room.remote_participants.values()), None)
            if participant is None:
                raise ToolError("No frontend participant in the room yet.")
            return await room.local_participant.perform_rpc(
                destination_identity=participant.identity,
                method=method,
                payload=json.dumps(payload or {}),
                response_timeout=timeout,
            )
        except ToolError as exc:
            last_error = exc
            if attempt >= retries:
                raise
            await asyncio.sleep(0.45 * (attempt + 1))
        except Exception as exc:
            last_error = exc
            logger.exception("RPC %s failed on attempt %s", method, attempt + 1)
            if attempt >= retries:
                raise ToolError(f"Could not run {method}: {exc}") from exc
            await asyncio.sleep(0.45 * (attempt + 1))

    raise ToolError(f"Could not run {method}: {last_error}")
