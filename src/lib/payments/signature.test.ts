import { describe, expect, it } from "vitest";
import {
  buildWebhookManifest,
  computeWebhookSignature,
  parseXSignatureHeader,
  verifyMercadoPagoSignature,
} from "./signature";

const SECRET = "test-webhook-secret";

describe("Mercado Pago webhook signature", () => {
  it("parses ts and v1 from x-signature", () => {
    expect(
      parseXSignatureHeader(
        "ts=1742505638683,v1=ced36ab6d33566bb1e16c125819b8d840d6b8ef136b0b9127c76064466f5229b",
      ),
    ).toEqual({
      ts: "1742505638683",
      v1: "ced36ab6d33566bb1e16c125819b8d840d6b8ef136b0b9127c76064466f5229b",
    });
  });

  it("omits missing id and request-id pairs from the manifest", () => {
    expect(buildWebhookManifest({ ts: "100" })).toBe("ts:100;");
    expect(buildWebhookManifest({ dataId: "ABC123", ts: "100" })).toBe(
      "id:abc123;ts:100;",
    );
  });

  it("accepts a valid HMAC and rejects a tampered one", () => {
    const dataId = "123456";
    const requestId = "bb56a2f1-6aae-46ac-982e-9dcd3581d08e";
    const ts = "1742505638683";
    const manifest = buildWebhookManifest({ dataId, requestId, ts });
    const v1 = computeWebhookSignature(SECRET, manifest);

    expect(
      verifyMercadoPagoSignature({
        xSignature: `ts=${ts},v1=${v1}`,
        xRequestId: requestId,
        dataId,
        secret: SECRET,
      }),
    ).toBe(true);

    expect(
      verifyMercadoPagoSignature({
        xSignature: `ts=${ts},v1=${"0".repeat(v1.length)}`,
        xRequestId: requestId,
        dataId,
        secret: SECRET,
      }),
    ).toBe(false);
  });
});
