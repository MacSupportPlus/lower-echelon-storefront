// One-time (or re-runnable) seed: loads the static catalog into real DB rows,
// and creates the first admin login from env vars. Run with:
//   npx tsx prisma/seed/seed.ts
//
// Uses Kysely directly — the same runtime query layer the app uses — not Prisma Client.
import { config } from "dotenv";
config({ path: ".env.local" });

import { Kysely } from "kysely";
import { NeonDialect } from "kysely-neon";
import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";
import type { DB } from "../../src/generated/kysely/types.js";
import { products } from "../../src/data/products.js";

const sql = neon(process.env.DATABASE_URL!);
const db = new Kysely<DB>({ dialect: new NeonDialect({ neon: sql }) });

// No real per-variant stock data came from the old WooCommerce export (it only exposed
// an overall in-stock flag). Sold-out products get 0 stock everywhere; in-stock products
// get a placeholder count the owner should correct from the admin once it exists.
const PLACEHOLDER_STOCK = 10;

async function seedProducts() {
  for (const p of products) {
    const id = randomUUID();
    const existing = await db.selectFrom("Product").select("id").where("slug", "=", p.slug).executeTakeFirst();
    if (existing) {
      console.log(`skip (exists): ${p.slug}`);
      continue;
    }

    await db
      .insertInto("Product")
      .values({
        id,
        slug: p.slug,
        name: p.name,
        description: "",
        details: p.details,
        category: p.category,
        price: Math.round(p.price * 100), // dollars -> cents
        active: true,
      })
      .execute();

    if (p.images.length > 0) {
      await db
        .insertInto("ProductImage")
        .values(p.images.map((url, i) => ({ id: randomUUID(), productId: id, url, position: i })))
        .execute();
    }

    const colors = p.colors.length > 0 ? p.colors : [""];
    const stock = p.soldOut ? 0 : PLACEHOLDER_STOCK;
    await db
      .insertInto("ProductVariant")
      .values(
        p.sizes.flatMap((size) => colors.map((color) => ({ id: randomUUID(), productId: id, size, color, stock }))),
      )
      .execute();

    console.log(`seeded: ${p.slug}`);
  }
}

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    console.log("ADMIN_EMAIL / ADMIN_PASSWORD not set in .env.local — skipping admin user creation.");
    return;
  }
  const existing = await db.selectFrom("AdminUser").select("id").where("email", "=", email).executeTakeFirst();
  if (existing) {
    console.log(`admin already exists: ${email}`);
    return;
  }
  const passwordHash = await bcrypt.hash(password, 12);
  await db.insertInto("AdminUser").values({ id: randomUUID(), email, passwordHash }).execute();
  console.log(`admin created: ${email}`);
}

await seedProducts();
await seedAdmin();
await db.destroy();
