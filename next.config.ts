/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['react-map-gl'],

  webpack: (config) => {
    config.module = config.module || {};
    config.module.rules = config.module.rules || [];
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: 'javascript/auto',
    });

    return config;
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  experimental: {
    allowedDevOrigins: [
      "https://jin-coronetlike-alena.ngrok-free.dev",
      "http://localhost:3000",
    ],
  },
};

// 👇 LO IMPORTANTE: Exportarlo como CommonJS
module.exports = nextConfig;
