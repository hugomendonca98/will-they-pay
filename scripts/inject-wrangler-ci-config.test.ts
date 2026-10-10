import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  injectWranglerCiConfig,
  normalizeDemoMode,
} from "./inject-wrangler-ci-config.mjs";

const wranglerJsonc = readFileSync(new URL("../wrangler.jsonc", import.meta.url), "utf8");

const DEMO_DB_ID = "11111111-2222-4333-8444-555555555555";
const DEMO_APP_URL = "https://will-they-pay.example.workers.dev";

describe("normalizeDemoMode", () => {
  it("treats empty as unchanged", () => {
    expect(normalizeDemoMode(undefined)).toBeNull();
    expect(normalizeDemoMode("")).toBeNull();
    expect(normalizeDemoMode("  ")).toBeNull();
  });

  it("accepts boolean-like strings", () => {
    expect(normalizeDemoMode("true")).toBe("true");
    expect(normalizeDemoMode("FALSE")).toBe("false");
  });
});

describe("injectWranglerCiConfig", () => {
  it("rewrites the committed placeholders on the real wrangler.jsonc", () => {
    const { text, appUrl, demoMode } = injectWranglerCiConfig(wranglerJsonc, {
      databaseId: DEMO_DB_ID,
      appUrl: `${DEMO_APP_URL}/`,
      demoMode: "true",
    });

    expect(appUrl).toBe(DEMO_APP_URL);
    expect(demoMode).toBe("true");
    expect(text).toContain(`"database_id": "${DEMO_DB_ID}"`);
    expect(text).toContain(`"APP_URL": "${DEMO_APP_URL}"`);
    expect(text).toContain(`"DEMO_MODE": "true"`);
    expect(text).not.toContain("http://localhost:3000");
    expect(text).not.toContain("00000000-0000-0000-0000-000000000000");
  });

  it("leaves DEMO_MODE out when unset so --keep-vars can preserve the dashboard value", () => {
    const { text, demoMode } = injectWranglerCiConfig(wranglerJsonc, {
      databaseId: DEMO_DB_ID,
      appUrl: DEMO_APP_URL,
    });

    expect(demoMode).toBeNull();
    expect(text).not.toMatch(/"DEMO_MODE"/);
  });

  it("rejects localhost APP_URL so Wrangler cannot publish the template default", () => {
    expect(() =>
      injectWranglerCiConfig(wranglerJsonc, {
        databaseId: DEMO_DB_ID,
        appUrl: "http://localhost:3000",
      }),
    ).toThrow(/localhost/);
  });

  it("rejects a missing APP_URL", () => {
    expect(() =>
      injectWranglerCiConfig(wranglerJsonc, {
        databaseId: DEMO_DB_ID,
        appUrl: "",
      }),
    ).toThrow(/APP_URL is required/);
  });
});
