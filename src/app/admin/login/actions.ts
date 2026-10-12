"use server";

import { verifyLogin, createSession } from "@/lib/auth";

export async function login(formData: FormData): Promise<{ error: string } | undefined> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  const user = await verifyLogin(email, password);
  if (!user) return { error: "Wrong email or password." };

  await createSession(user.id);
  // No redirect() here — the client navigates itself after seeing a successful (no-error)
  // result, since this is called directly rather than through <form action>.
}
