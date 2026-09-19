const { withSentryConfig } = require("@sentry/nextjs/config");

const isDevelopment = process.env.NODE_ENV !== "production";

const nextConfig = {
  transpilePackages: ['recharts', 'firebase'],
  images: {
    remotePatterns: [],
  },
  async headers() {
    const configuredOrigins = process.env.CORS_ORIGINS
      ? process.env.CORS_ORIGINS.split(',').map((origin) => origin.trim()).filter(Boolean)
      : [];
    const corsOriginHeader = configuredOrigins[0] || '*';

    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              [
                "script-src 'self' 'wasm-unsafe-eval'",
                isDevelopment ? "'unsafe-inline' 'unsafe-eval'" : "",
                "https://apis.google.com https://cdn.jsdelivr.net https://www.googletagmanager.com https://sentry.io",
              ].filter(Boolean).join(" "),
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: https:",
              "font-src 'self' https://fonts.gstatic.com",
              "connect-src 'self' https://*.firebase.com https://*.firebaseapp.com https://*.googleapis.com https://accounts.google.com https://sentry.io https://*.upstash.io",
              "frame-src 'self' https://*.firebaseapp.com https://accounts.google.com https://www.google.com",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "upgrade-insecure-requests",
            ].join('; '),
          },
          { key: "Access-Control-Allow-Origin", value: corsOriginHeader },
          { key: "Access-Control-Allow-Methods", value: "GET, POST, PUT, DELETE, OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "*" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

module.exports = withSentryConfig(nextConfig, {
  silent: true,
  org: "iora",
  project: "iora",
});
