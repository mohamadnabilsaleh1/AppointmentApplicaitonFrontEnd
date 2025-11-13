/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode
  reactStrictMode: true,

  // Fix for images.domains deprecation
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5001",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**", // For external sources
        pathname: "/**",
      },
    ],
    // ✅ Allow non-optimized local images for development
    unoptimized: process.env.NODE_ENV === "development",
  },

  // Fix for Turbopack warning - add empty turbopack config
  turbopack: {},

  // Webpack configuration for SignalR (keep your existing config)
  webpack: (config, { isServer }) => {
    // Don't attempt to polyfill node modules on the client
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        // Polyfills for SignalR
        net: false,
        tls: false,
        fs: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
      };
    }

    return config;
  },

  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
};

module.exports = nextConfig;

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,

//   images: {
//     remotePatterns: [
//       {
//         protocol: "http",
//         hostname: "localhost",
//         port: "5001",
//         pathname: "/**",
//       },
//       {
//         protocol: "https",
//         hostname: "**", // For external sources
//         pathname: "/**",
//       },
//     ],
//     // ✅ Allow non-optimized local images for development
//     unoptimized: process.env.NODE_ENV === "development",
//   },

//   webpack: (config, { isServer }) => {
//     if (!isServer) {
//       config.resolve.fallback = {
//         fs: false,
//         net: false,
//         tls: false,
//         crypto: false,
//         stream: false,
//         url: false,
//         zlib: false,
//         http: false,
//         https: false,
//         assert: false,
//       };
//     }
//     return config;
//   },

//   async headers() {
//     return [
//       {
//         source: "/(.*)",
//         headers: [
//           { key: "X-Frame-Options", value: "DENY" },
//           { key: "X-Content-Type-Options", value: "nosniff" },
//           { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
//           { key: "Permissions-Policy", value: "geolocation=(), microphone=()" },
//         ],
//       },
//     ];
//   },
// };

// module.exports = nextConfig;

