/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com', 'res.cloudinary.com'],
  },
  // Optimisation pour le déploiement sur Cloudflare Pages (runtime edge compatible)
  experimental: {
    runtime: 'edge',
  }
};

module.exports = nextConfig;
