import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  // Cache Components (`cacheComponents` + `partialPrefetching`) hangs the
  // OpenNext 1.20.9 Worker at request time. Re-enable when the adapter
  // supports Next 16 Cache Components on workerd.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

// Bindings (D1, secrets from `.dev.vars`) are only needed in `next dev`.
if (process.env.NODE_ENV === "development") {
  void initOpenNextCloudflareForDev();
}
