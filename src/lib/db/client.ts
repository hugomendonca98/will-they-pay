import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";
import type { AppDatabase } from "./types";

export async function getDb(): Promise<AppDatabase> {
  const { env } = await getCloudflareContext({ async: true });

  if (!env.DB) {
    throw new Error("D1 binding `DB` is not configured. Check wrangler.jsonc.");
  }

  return drizzle(env.DB, { schema });
}
