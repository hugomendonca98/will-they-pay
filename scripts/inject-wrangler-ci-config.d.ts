export function normalizeDemoMode(raw?: unknown): "true" | "false" | null;

export function injectWranglerCiConfig(
  source: string,
  options: {
    databaseId?: string;
    appUrl?: string;
    demoMode?: string | null;
  },
): {
  text: string;
  appUrl: string;
  demoMode: "true" | "false" | null;
};
