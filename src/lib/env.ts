import { MissingSecretError } from "@/lib/errors";

export type Clock = {
  now(): number;
};

export const systemClock: Clock = {
  now: () => Date.now(),
};

export type IdGenerator = {
  id(): string;
};

export const cryptoIdGenerator: IdGenerator = {
  id: () => crypto.randomUUID(),
};

export type AppEnv = {
  appUrl: string;
  mercadoPagoAccessToken: string;
  mercadoPagoWebhookSecret: string;
  mercadoPagoSandbox: boolean;
};

function readRequired(env: CloudflareEnv, name: keyof CloudflareEnv): string {
  const value = env[name];
  if (typeof value !== "string" || value.trim() === "") {
    throw new MissingSecretError(String(name));
  }
  return value.trim();
}

function isPlaceholder(value: string): boolean {
  const normalized = value.toLowerCase();
  return (
    normalized.startsWith("replace-with-") ||
    normalized.includes("your-") ||
    normalized === "changeme" ||
    normalized === "todo"
  );
}

/**
 * Reads Worker bindings. Secret values are never logged.
 * Placeholder example values are treated as missing so checkout fails closed.
 */
export function readAppEnv(env: CloudflareEnv): AppEnv {
  const accessToken = readRequired(env, "MERCADOPAGO_ACCESS_TOKEN");
  const webhookSecret = readRequired(env, "MERCADOPAGO_WEBHOOK_SECRET");
  const appUrl = readRequired(env, "APP_URL").replace(/\/$/, "");

  if (isPlaceholder(accessToken)) {
    throw new MissingSecretError("MERCADOPAGO_ACCESS_TOKEN");
  }
  if (isPlaceholder(webhookSecret)) {
    throw new MissingSecretError("MERCADOPAGO_WEBHOOK_SECRET");
  }

  const sandboxRaw = env.MERCADOPAGO_SANDBOX?.trim().toLowerCase();
  const mercadoPagoSandbox = sandboxRaw !== "false" && sandboxRaw !== "0";

  return {
    appUrl,
    mercadoPagoAccessToken: accessToken,
    mercadoPagoWebhookSecret: webhookSecret,
    mercadoPagoSandbox,
  };
}

export async function getWorkerEnv(): Promise<CloudflareEnv> {
  const { getCloudflareContext } = await import("@opennextjs/cloudflare");
  const { env } = await getCloudflareContext({ async: true });
  return env;
}
