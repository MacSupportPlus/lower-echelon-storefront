import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

// Owner-only admin auth. Sessions are DB rows (not JWTs) so one can be revoked
// instantly by deleting its row — useful if a device is lost. bcryptjs (pure JS,
// no native addon) because Cloudflare Workers can't load native binaries.
const COOKIE = "le_admin_session";
const SESSION_DAYS = 14;

export async function verifyLogin(email: string, password: string) {
  const user = await db.selectFrom("AdminUser").selectAll().where("email", "=", email).executeTakeFirst();
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.passwordHash);
  return ok ? user : null;
}

export async function createSession(adminUserId: string) {
  const id = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  await db.insertInto("AdminSession").values({ id, adminUserId, expiresAt }).execute();

  const jar = await cookies();
  jar.set(COOKIE, id, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function getSession() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;

  const session = await db
    .selectFrom("AdminSession")
    .innerJoin("AdminUser", "AdminUser.id", "AdminSession.adminUserId")
    .select(["AdminSession.id", "AdminSession.expiresAt", "AdminUser.id as userId", "AdminUser.email"])
    .where("AdminSession.id", "=", token)
    .executeTakeFirst();

  if (!session || session.expiresAt < new Date()) return null;
  return { userId: session.userId, email: session.email };
}

export async function destroySession() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (token) {
    await db.deleteFrom("AdminSession").where("id", "=", token).execute();
  }
  jar.delete(COOKIE);
}
