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
      {
        source: '/post/mi-experiencia-profesional',
        destination: '/post/my-professional-experience',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
