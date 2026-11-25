/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.jsdelivr.net',
      },
      {
        protocol: 'https',
        hostname: 'img.shields.io',
      },
      {
        protocol: 'https',
        hostname: 'github-readme-stats.vercel.app',
      },
      {
        protocol: 'https',
        hostname: 'ghchart.rshah.org',
      },
      {
        protocol: 'https',
        hostname: 'github-readme-streak-stats.herokuapp.com',
      }
    ],
    domains: ['raw.githubusercontent.com'],
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ],
      },
    ]
  },
  // www.cotneo.com/tv is the Cotneo TV site: a separate Vercel project (CotNeo/android-tv-browser, website/)
  // built with basePath /tv, so its pages and /tv/_next assets are proxied as they are. It is reached through
  // its custom domain because Vercel Authentication protects the project's vercel.app addresses.
  //
  // www.cotneo.com/game is the browser game "Kırık Akor: Son Gece": a separate Vercel project (CotNeo/mobile_game)
  // built with base /game/, so its page and its /game/static and /game/assets files are proxied as they are.
  //
  // www.cotneo.com/atlasfit is the Atlas Fit site: a separate Vercel project (CotNeo/Atlas-Fit, website/) built
  // with basePath /atlasfit, reached through its custom domain like /tv.
  async rewrites() {
    const tv = 'https://tv.cotneo.com';
    const game = 'https://kirik-akor.vercel.app';
    const atlasfit = 'https://atlasfit.cotneo.com';
    return {
      beforeFiles: [
        { source: '/tv', destination: `${tv}/tv` },
        { source: '/tv/:path*', destination: `${tv}/tv/:path*` },
        { source: '/game', destination: `${game}/game` },
        { source: '/game/:path*', destination: `${game}/game/:path*` },
        { source: '/atlasfit', destination: `${atlasfit}/atlasfit` },
        { source: '/atlasfit/:path*', destination: `${atlasfit}/atlasfit/:path*` },
        // App links are looked up at the root of the domain.
        { source: '/.well-known/apple-app-site-association', destination: `${tv}/tv/.well-known/apple-app-site-association` },
        { source: '/.well-known/assetlinks.json', destination: `${tv}/tv/.well-known/assetlinks.json` },
      ],
    };
  },
  async redirects() {
    return [
      {
        source: '/github',
        destination: 'https://github.com/cotneo',
        permanent: true,
      },
      {
        source: '/linkedin',
        destination: 'https://linkedin.com/in/furkanaliakar',
        permanent: true,
      },
    ]
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
};

module.exports = nextConfig; 