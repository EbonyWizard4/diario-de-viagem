import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.google.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Essencial para as fotos de perfil do Google
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com', // Já deixa pronto para quando usarmos o Storage
      },
      {
        protocol: 'https',
        hostname: 'ntywugnkjwy7nqb4.public.blob.vercel-storage.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
