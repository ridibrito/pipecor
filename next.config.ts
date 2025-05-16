// next.config.mjs (ou next.config.js)

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ...outras configurações que você possa ter...
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'bzqhteduzkxgwnlledly.supabase.co', // Seu hostname do Supabase Storage
        port: '', // Deixe vazio para portas padrão (80 para http, 443 para https)
        pathname: '/storage/v1/object/public/avatars/**', // Permite qualquer imagem dentro do bucket 'avatars'
      },
      // Você pode adicionar outros patterns aqui se precisar de outros hosts
    ],
  },
  // ...outras configurações que você possa ter...
};

export default nextConfig;