/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode
  reactStrictMode: true,
  
  // Fix for images.domains deprecation
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5001',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**', // Allow all HTTPS domains (adjust as needed)
      },
    ],
    domains: [], // Keep empty to avoid deprecation warning
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