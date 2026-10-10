import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const PLACEHOLDER_DB_ID = "00000000-0000-0000-0000-000000000000";
const LOCAL_APP_URL = "http://localhost:3000";

const DATABASE_ID_LINE = /("database_id"\s*:\s*)"[^"]*"/;
const APP_URL_LINE = /("APP_URL"\s*:\s*)"[^"]*"/;
const DEMO_MODE_LINE = /("DEMO_MODE"\s*:\s*)"[^"]*"/;

/**
 * @param {unknown} raw
 * @returns {"true" | "false" | null}
 */
export function normalizeDemoMode(raw) {
  if (raw == null) {
    return null;
  }
  const normalized = String(raw).trim().toLowerCase();
  if (normalized === "") {
    return null;
  }
  if (normalized === "true" || normalized === "1" || normalized === "yes") {
    return "true";
  }
  if (normalized === "false" || normalized === "0" || normalized === "no") {
    return "false";
  }
  throw new Error(
    `DEMO_MODE must be true or false (or unset). Received: ${JSON.stringify(raw)}`,
  );
}

/**
 * Rewrites a wrangler.jsonc source so CI can deploy without committing the
 * real D1 id or demo APP_URL. Wrangler uploads `vars` from this file; CLI
 * `--var` is not relied on because it may not override baked-in config values.
 *
 * @param {string} source
 * @param {{ databaseId?: string, appUrl?: string, demoMode?: string | null }} options
 */
export function injectWranglerCiConfig(source, options) {
  const databaseId = String(options.databaseId ?? "").trim();
  const appUrl = String(options.appUrl ?? "")
    .trim()
    .replace(/\/$/, "");
  const demoMode = normalizeDemoMode(options.demoMode);

  if (!UUID_RE.test(databaseId)) {
    throw new Error("D1_DATABASE_ID must be a UUID.");
  }
  if (!appUrl) {
    throw new Error(
      "APP_URL is required for deploy. Set the APP_URL GitHub Actions variable (or secret) to the public HTTPS origin, with no trailing slash.",
    );
  }
  if (/^https?:\/\/(localhost|127\.0\.0\.1)(:|\/|$)/i.test(appUrl)) {
    throw new Error("APP_URL must not be localhost for a Cloudflare deploy.");
  }
  if (!/^https:\/\//i.test(appUrl)) {
    throw new Error("APP_URL must be an https:// URL with no trailing slash.");
  }
  if (!DATABASE_ID_LINE.test(source)) {
    throw new Error("wrangler.jsonc is missing a database_id field.");
  }
  if (!APP_URL_LINE.test(source)) {
    throw new Error("wrangler.jsonc is missing vars.APP_URL.");
  }

  let text = source.replace(DATABASE_ID_LINE, `$1${JSON.stringify(databaseId)}`);
  text = text.replace(APP_URL_LINE, () => {
    const appUrlLine = `"APP_URL": ${JSON.stringify(appUrl)}`;
    if (demoMode != null && !DEMO_MODE_LINE.test(source)) {
      return `${appUrlLine},\n    "DEMO_MODE": ${JSON.stringify(demoMode)}`;
    }
    return appUrlLine;
  });
  if (demoMode != null && DEMO_MODE_LINE.test(source)) {
    text = text.replace(DEMO_MODE_LINE, `$1${JSON.stringify(demoMode)}`);
  }

  if (text.includes(LOCAL_APP_URL)) {
    throw new Error(
      "Refusing to deploy: wrangler.jsonc still contains the localhost APP_URL.",
    );
  }
  if (text.includes(PLACEHOLDER_DB_ID)) {
    throw new Error("Refusing to deploy: placeholder D1 database_id is still present.");
  }

  return { text, appUrl, demoMode };
}

function isDirectRun() {
  const entry = process.argv[1];
  if (!entry) {
    return false;
  }
  return import.meta.url === pathToFileURL(path.resolve(entry)).href;
}

function main() {
  const filePath = path.resolve(process.argv[2] ?? "wrangler.jsonc");
  const source = fs.readFileSync(filePath, "utf8");
  const { text, appUrl, demoMode } = injectWranglerCiConfig(source, {
    databaseId: process.env.D1_DATABASE_ID,
    appUrl: process.env.APP_URL,
    demoMode: process.env.DEMO_MODE,
  });
  fs.writeFileSync(filePath, text);
  const demoLabel = demoMode == null ? "(unchanged)" : demoMode;
  console.log(`Injected CI wrangler config: APP_URL=${appUrl} DEMO_MODE=${demoLabel}`);
}

if (isDirectRun()) {
  main();
}
