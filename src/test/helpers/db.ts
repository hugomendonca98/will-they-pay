import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "@/lib/db/schema";
import type { AppDatabase } from "@/lib/db/types";

const CREATE_TABLES_SQL = `
CREATE TABLE leads (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT,
  created_at INTEGER NOT NULL
);

CREATE TABLE orders (
  id TEXT PRIMARY KEY NOT NULL,
  status TEXT NOT NULL,
  amount_cents INTEGER NOT NULL,
  currency TEXT NOT NULL,
  title TEXT NOT NULL,
  payer_email TEXT,
  payer_name TEXT,
  preference_id TEXT,
  checkout_url TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE payments (
  id TEXT PRIMARY KEY NOT NULL,
  order_id TEXT NOT NULL,
  mercadopago_payment_id TEXT NOT NULL,
  status TEXT NOT NULL,
  status_detail TEXT,
  payload_json TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id)
);

CREATE UNIQUE INDEX payments_mp_id_idx ON payments (mercadopago_payment_id);
`;

export function createTestDb(): AppDatabase {
  const sqlite = new Database(":memory:");
  sqlite.exec(CREATE_TABLES_SQL);
  return drizzle(sqlite, { schema });
}

export function createFixedClock(now = 1_700_000_000_000) {
  return { now: () => now };
}

export function createFixedIds(id = "id-1") {
  let index = 0;
  return {
    id: () => {
      index += 1;
      return index === 1 ? id : `${id}-${index}`;
    },
  };
}
