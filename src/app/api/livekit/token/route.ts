import { NextResponse } from 'next/server';
import { AccessToken } from 'livekit-server-sdk';
import { RoomAgentDispatch, RoomConfiguration } from '@livekit/protocol';

const PRODUCTS = {
  'ai-after-hours': {
    agentName: process.env.LIVEKIT_AGENT_NAME || 'ai-after-hours-guide',
    roomPrefix: 'ai-after-hours',
    guestName: 'AI After Hours Guest',
    screen: 'slide-deck',
  },
  'noshy-voice': {
    agentName: process.env.LIVEKIT_NOSHY_AGENT_NAME || 'noshy-voice-host',
    roomPrefix: 'noshy-voice',
    guestName: 'NoShy Guest',
    screen: 'noshy-voice',
  },
} as const;

type Product = keyof typeof PRODUCTS;

/**
 * Mint a join token that dispatches a voice agent when the guest connects
 * (RoomAgentDispatch on first join). `product` picks which agent.
 *
 * @see https://docs.livekit.io/frontends/build/authentication/
 */
export async function POST(request: Request) {
  const url = process.env.LIVEKIT_URL || process.env.NEXT_PUBLIC_LIVEKIT_URL;
  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;

  if (!url || !apiKey || !apiSecret) {
    return NextResponse.json(
      {
        error: 'livekit_not_configured',
        message: 'Set LIVEKIT_URL, LIVEKIT_API_KEY, and LIVEKIT_API_SECRET.',
      },
      { status: 503 }
    );
  }

  let body: { room?: string; identity?: string; agentName?: string; product?: string } = {};
  try {
    body = await request.json();
  } catch {
    /* empty body ok */
  }

  const product: Product =
    body.product && body.product in PRODUCTS ? (body.product as Product) : 'ai-after-hours';
  const config = PRODUCTS[product];

  const roomName =
    body.room?.trim() ||
    `${config.roomPrefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const identity =
    body.identity?.trim() ||
    `guest-${Math.random().toString(36).slice(2, 10)}`;
  const dispatchAgent = body.agentName?.trim() || config.agentName;

  try {
    const at = new AccessToken(apiKey, apiSecret, {
      identity,
      ttl: '1h',
      name: config.guestName,
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
            product,
            screen: config.screen,
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
