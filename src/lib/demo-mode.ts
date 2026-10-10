import { getWorkerEnv } from "@/lib/env";

/**
 * Parses DEMO_MODE from Worker env at runtime. Default is off when unset.
 */
export function parseDemoMode(raw?: string): boolean {
  if (raw == null) {
    return false;
  }
  const normalized = raw.trim().toLowerCase();
  if (normalized === "") {
    return false;
  }
  return normalized === "true" || normalized === "1" || normalized === "yes";
}

export async function isDemoModeEnabled(): Promise<boolean> {
  try {
    const env = await getWorkerEnv();
    return parseDemoMode(env.DEMO_MODE);
  } catch {
    return false;
  }
}
