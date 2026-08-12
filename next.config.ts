import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/post/mi-experiencia-profesional',
        destination: '/post/my-professional-experience',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
