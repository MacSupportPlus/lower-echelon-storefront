import { Kysely } from "kysely";
import { NeonDialect } from "kysely-neon";
import { neon } from "@neondatabase/serverless";
import type { DB } from "@/generated/kysely/types";

// Neon's HTTP driver, plain Kysely — no Prisma Client / query-engine at runtime.
// That engine (native binary or WASM) can't run inside a Cloudflare Workers isolate;
// see the note atop prisma/schema.prisma for the full story. Prisma is schema/
// migrations tooling only here; this is the actual runtime query layer.
declare global {
  var __db: Kysely<DB> | undefined;
}

function createClient() {
  const sql = neon(process.env.DATABASE_URL!);
  return new Kysely<DB>({ dialect: new NeonDialect({ neon: sql }) });
}

// Reuse one instance across hot reloads in dev; Cloudflare Workers create a fresh
// module scope per isolate anyway, so this is a no-op safety net there.
export const db = globalThis.__db ?? createClient();
if (process.env.NODE_ENV !== "production") globalThis.__db = db;
