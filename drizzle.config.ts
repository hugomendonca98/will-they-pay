import { defineConfig } from "drizzle-kit";

/**
 * Generate SQL only. Migrations are applied with Wrangler (`pnpm run db:migrate:local`
 * / `pnpm run db:migrate:remote`) so this file never needs Cloudflare account IDs
 * or API tokens.
 */
export default defineConfig({
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dialect: "sqlite",
});
