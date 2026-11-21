import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // One canonical host: send the bare domain to www.
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'angelmateus.com' }],
        destination: 'https://www.angelmateus.com/:path*',
        permanent: true,
      },
      // Temporary: noshy-concierge (team neuro) is paused on Vercel Hobby limits.
      // Serve the subdomain from the portfolio's /noshy route until it's back.
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'noshy.angelmateus.com' }],
        destination: 'https://www.angelmateus.com/noshy',
        permanent: false,
      },
      {
        source: '/workshops/build-ai-voice-agent-elevenlabs-lovable',
        destination: '/workshops/build-ai-voice-agent-claude-elevenlabs',
        permanent: true,
      },
      {
        source: '/workshops/build-with-cloud-ai',
        destination: '/workshops/build-ai-voice-agent-claude-elevenlabs',
        permanent: true,
      },
      {
        source: '/post/mi-experiencia-profesional',
        destination: '/post/my-professional-experience',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
