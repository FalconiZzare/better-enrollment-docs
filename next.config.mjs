import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

const dev = process.env.NODE_ENV !== 'production';

// Static site, everything first-party. Inline scripts and styles stay
// allowed: Next's hydration data, the theme script and JSON-LD are inline,
// and nonces would force per-request rendering. Dev adds what HMR needs.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${dev ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  `connect-src 'self'${dev ? ' ws: wss:' : ''}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(dev ? [] : ['upgrade-insecure-requests']),
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
];

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  // next dev would otherwise write an AGENTS.md into the repo.
  agentRules: false,
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
  async redirects() {
    return [
      {
        source: '/docs/client-api',
        destination: '/docs/api',
        permanent: true,
      },
    ];
  },
};

export default withMDX(config);
