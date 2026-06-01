import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "Permissions-Policy",
    // `unload=*` allows the deprecated unload event in this document and any
    // sub-frames. Some third-party scripts inside the live-site iframe
    // previews (e.g. Google Maps) still rely on it, and without this they
    // log "Permissions policy violation: unload is not allowed" warnings.
    value: "camera=(), microphone=(), geolocation=(), unload=*",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
