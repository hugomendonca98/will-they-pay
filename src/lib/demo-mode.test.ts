import { describe, expect, it } from "vitest";
import { parseDemoMode } from "./demo-mode";

describe("parseDemoMode", () => {
  it("is off when unset or empty", () => {
    expect(parseDemoMode(undefined)).toBe(false);
    expect(parseDemoMode("")).toBe(false);
    expect(parseDemoMode("   ")).toBe(false);
  });

  it("is on for common truthy strings", () => {
    expect(parseDemoMode("true")).toBe(true);
    expect(parseDemoMode("TRUE")).toBe(true);
    expect(parseDemoMode("1")).toBe(true);
    expect(parseDemoMode("yes")).toBe(true);
  });

  it("is off for other values", () => {
    expect(parseDemoMode("false")).toBe(false);
    expect(parseDemoMode("0")).toBe(false);
    expect(parseDemoMode("no")).toBe(false);
  });
});
