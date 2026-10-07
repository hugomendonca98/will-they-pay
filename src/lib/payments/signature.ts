import { createHmac, timingSafeEqual } from "node:crypto";

export type ParsedSignature = {
  ts: string;
  v1: string;
};

export function parseXSignatureHeader(header: string): ParsedSignature | null {
  let ts: string | undefined;
  let v1: string | undefined;

  for (const part of header.split(",")) {
    const separator = part.indexOf("=");
    if (separator === -1) continue;
    const key = part.slice(0, separator).trim();
    const value = part.slice(separator + 1).trim();
    if (key === "ts") ts = value;
    if (key === "v1") v1 = value;
  }

  if (!ts || !v1) return null;
  return { ts, v1 };
}

/**
 * Mercado Pago webhook manifest.
 * Omit `id` / `request-id` pairs when those values are absent.
 * Lowercase `data.id` before hashing (required for alphanumeric IDs).
 */
export function buildWebhookManifest(input: {
  dataId?: string;
  requestId?: string;
  ts: string;
}): string {
  const parts: string[] = [];
  const dataId = input.dataId?.trim().toLowerCase();
  const requestId = input.requestId?.trim();

  if (dataId) parts.push(`id:${dataId}`);
  if (requestId) parts.push(`request-id:${requestId}`);
  parts.push(`ts:${input.ts}`);

  return `${parts.join(";")};`;
}

export function computeWebhookSignature(secret: string, manifest: string): string {
  return createHmac("sha256", secret).update(manifest).digest("hex");
}

export function signaturesMatch(expectedHex: string, receivedHex: string): boolean {
  const expected = Buffer.from(expectedHex);
  const received = Buffer.from(receivedHex);

  if (expected.length !== received.length) {
    return false;
  }

  return timingSafeEqual(expected, received);
}

export function verifyMercadoPagoSignature(input: {
  xSignature: string;
  xRequestId?: string;
  dataId?: string;
  secret: string;
}): boolean {
  const parsed = parseXSignatureHeader(input.xSignature);
  if (!parsed) return false;

  const manifest = buildWebhookManifest({
    dataId: input.dataId,
    requestId: input.xRequestId,
    ts: parsed.ts,
  });
  const expected = computeWebhookSignature(input.secret, manifest);

  return signaturesMatch(expected, parsed.v1);
}
