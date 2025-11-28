/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Puedes usar remotePatterns o domains, aquí combino ambos por claridad
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/",
      },
      {
        protocol: "https",
        hostname: "cdn-icons-png.flaticon.com",
        pathname: "/",
      },
    ],
    // Opcional: dominios permitidos directos
    domains: [
      "images.unsplash.com",
      "lh3.googleusercontent.com",
      "cdn-icons-png.flaticon.com",
    ],
  },

  experimental: {
    optimizeCss: true,
  },

  eslint: {
    // ⚠ Esto hace que el build no falle por errores de ESLint
    ignoreDuringBuilds: true,
  },

  typescript: {
    // ⚠ Esto hace que el build no falle por errores de TypeScript
    ignoreBuildErrors: true,
  },
};

export default nextConfig;