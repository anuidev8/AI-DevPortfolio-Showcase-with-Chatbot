import { NextResponse } from 'next/server';
import { AccessToken } from 'livekit-server-sdk';
import { RoomAgentDispatch, RoomConfiguration } from '@livekit/protocol';

/**
 * Mint a join token that dispatches the AI After Hours voice guide
 * when the guest connects (RoomAgentDispatch on first join).
 *
 * @see https://docs.livekit.io/frontends/build/authentication/
 */
export async function POST(request: Request) {
  const url = process.env.LIVEKIT_URL || process.env.NEXT_PUBLIC_LIVEKIT_URL;
  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;
  const agentName = process.env.LIVEKIT_AGENT_NAME || 'ai-after-hours-guide';

  if (!url || !apiKey || !apiSecret) {
    return NextResponse.json(
      {
        error: 'livekit_not_configured',
        message: 'Set LIVEKIT_URL, LIVEKIT_API_KEY, and LIVEKIT_API_SECRET.',
      },
      { status: 503 }
    );
  }

  let body: { room?: string; identity?: string; agentName?: string } = {};
  try {
    body = await request.json();
  } catch {
    /* empty body ok */
  }

  const roomName =
    body.room?.trim() ||
    `ai-after-hours-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const identity =
    body.identity?.trim() ||
    `guest-${Math.random().toString(36).slice(2, 10)}`;
  const dispatchAgent = body.agentName?.trim() || agentName;

  try {
    const at = new AccessToken(apiKey, apiSecret, {
      identity,
      ttl: '1h',
      name: 'AI After Hours Guest',
    });
    at.addGrant({
      roomJoin: true,
      roomCreate: true,
      room: roomName,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
      canUpdateOwnMetadata: true,
    });
    at.roomConfig = new RoomConfiguration({
      agents: [
        new RoomAgentDispatch({
          agentName: dispatchAgent,
          metadata: JSON.stringify({
            product: 'ai-after-hours',
            screen: 'slide-deck',
          }),
        }),
      ],
    });

    const token = await at.toJwt();
    return NextResponse.json({
      token,
      url,
      roomName,
      identity,
      agentName: dispatchAgent,
    });
  } catch (err) {
    console.error('[livekit/token]', err);
    return NextResponse.json(
      { error: 'token_failed', message: 'Could not mint LiveKit token.' },
      { status: 500 }
    );
  }
}
