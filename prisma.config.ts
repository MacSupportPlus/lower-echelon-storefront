// Prisma CLI config (schema + migrations only — see the note atop schema.prisma).
// Connection URL lives in .env.local (written by `neon link`), the same file
// Next.js reads automatically, so there's one source of truth for it.
import { config } from "dotenv";
config({ path: ".env.local" });

import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
