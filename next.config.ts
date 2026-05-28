import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Image optimization
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },

  // Static export disabled in dev - enable for production build
  // output: "export",
  // distDir: "dist",

  // Compress assets
  compress: true,

  // Disable x-powered-by header for security
  poweredByHeader: false,

  // Enable React strict mode
  reactStrictMode: true,

  // SWC compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // Experimental features for optimization
  experimental: {
    optimizePackageImports: [
      "framer-motion",
      "@react-three/drei",
      "@react-three/fiber",
      "three",
    ],
    webVitalsAttribution: ["CLS", "LCP", "FCP", "FID", "TTFB", "INP"],
  },

  // Headers for caching and security
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400",
          },
        ],
      },
    ];
  },

  // Redirects — Vercel edge already handles apex → www (project canonical).
  // Do NOT add a www → apex rule here; it loops against the Vercel edge.
  async redirects() {
    return [];
  },

  // Rewrites (if needed)
  async rewrites() {
    return [];
  },
};

export default nextConfig;
