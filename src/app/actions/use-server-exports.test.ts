import { readFileSync } from "node:fs";
import { readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const srcRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");

function collectSourceFiles(dir: string, acc: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectSourceFiles(fullPath, acc);
    } else if (/\.(ts|tsx)$/.test(entry.name) && !entry.name.endsWith(".test.ts")) {
      acc.push(fullPath);
    }
  }
  return acc;
}

function isUseServerFile(source: string): boolean {
  return /^\s*["']use server["'];?\s*$/m.test(source.split("\n").slice(0, 5).join("\n"));
}

/** Next.js production rejects non-async-function value exports from "use server" modules. */
function findInvalidValueExports(source: string): string[] {
  const invalid: string[] = [];

  for (const line of source.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed.startsWith("export ")) continue;
    if (trimmed.startsWith("export type ")) continue;
    if (trimmed.startsWith("export interface ")) continue;
    if (/^export\s+async\s+function\s/.test(trimmed)) continue;
    if (/^export\s*\{\s*type\s+/.test(trimmed)) continue;
    if (/^export\s*\{[^}]*\}\s*from\s+/.test(trimmed)) continue;

    if (
      /^export\s+(const|let|var|class|enum|function|default)\b/.test(trimmed) ||
      /^export\s*\{/.test(trimmed)
    ) {
      invalid.push(trimmed);
    }
  }

  return invalid;
}

describe('"use server" export guard', () => {
  it('only exports async functions from "use server" modules', () => {
    const offenders: { file: string; exports: string[] }[] = [];

    for (const file of collectSourceFiles(srcRoot)) {
      const source = readFileSync(file, "utf8");
      if (!isUseServerFile(source)) continue;

      const invalid = findInvalidValueExports(source);
      if (invalid.length > 0) {
        offenders.push({ file: path.relative(srcRoot, file), exports: invalid });
      }
    }

    expect(offenders).toEqual([]);
  });
});
