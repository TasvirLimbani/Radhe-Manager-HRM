// /** @type {import('next').NextConfig} */
// import withPWA from "next-pwa";

// const nextConfig = {
//   typescript: {
//     ignoreBuildErrors: true,
//   },
//   images: {
//     unoptimized: true,
//     domains: ["shikhagarments.soon.it"],
//   },
//   turbopack: {},
//   allowedDevOrigins: ["localhost", "127.0.0.1", "192.168.1.5", "0.0.0.0"],
// };

// const withPWAConfig = withPWA({
//   dest: "public",
//   register: true,
//   skipWaiting: true,
//   disable: process.env.NODE_ENV === "development",
//   runtimeCaching: [
//     {
//       urlPattern: /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
//       handler: "CacheFirst",
//       options: {
//         cacheName: "google-fonts-webfonts",
//         expiration: {
//           maxEntries: 4,
//           maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
//         },
//       },
//     },
//     {
//       urlPattern: /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
//       handler: "StaleWhileRevalidate",
//       options: {
//         cacheName: "google-fonts-stylesheets",
//         expiration: {
//           maxEntries: 4,
//           maxAgeSeconds: 7 * 24 * 60 * 60, // 1 week
//         },
//       },
//     },
//     {
//       urlPattern: /^https:\/\/cdn\.jsdelivr\.net\/.*/i,
//       handler: "CacheFirst",
//       options: {
//         cacheName: "cdn-cache",
//         expiration: {
//           maxEntries: 30,
//           maxAgeSeconds: 60 * 60 * 24 * 30, // 1 month
//         },
//       },
//     },
//   ],
// });

// export default withPWAConfig(nextConfig);

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "shikhagarments.soon.it",
      },
      {
        protocol: "https",
        hostname: "shikhagarments.soon.it",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "upgrade-insecure-requests;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
