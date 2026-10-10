/// <reference types="@cloudflare/workers-types" />

/**
 * Augments the OpenNext `CloudflareEnv` interface.
 * Secret values are injected at runtime — never hardcoded.
 */
declare global {
  interface CloudflareEnv {
    DB: D1Database;
    APP_URL: string;
    MERCADOPAGO_SANDBOX?: string;
    MERCADOPAGO_ACCESS_TOKEN: string;
    MERCADOPAGO_WEBHOOK_SECRET: string;
    /** When "true", shows the optional public-demo warning bar (runtime only). */
    DEMO_MODE?: string;
  }
}

export {};
