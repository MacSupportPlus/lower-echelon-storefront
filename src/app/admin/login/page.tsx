"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { login } from "./actions";

// Deliberately NOT useActionState + <form action={fn}>: that combo only dispatches once —
// after the first submission resolves, the browser's native submit event stops firing on
// further clicks (reproduced with both full Chromium and chrome-headless-shell, so it's a
// real framework/browser interaction quirk, not a test artifact). useTransition + calling
// the server action directly is the pattern already used elsewhere in the admin
// (variant-editor.tsx, image-editor.tsx) and doesn't have this problem.
export default function AdminLoginPage() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await login(formData);
      if (res?.error) setError(res.error);
      else router.push("/admin");
    });
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-5">
      <form onSubmit={onSubmit} className="w-full max-w-sm">
        <h1 className="display text-5xl">Staff only</h1>
        <p className="label mt-2 text-concrete-500">Lower Echelon Worldwide — admin</p>

        <div className="mt-10 space-y-4">
          <div>
            <label htmlFor="email" className="label text-concrete-500">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoFocus
              autoComplete="username"
              className="mt-2 w-full border border-concrete-700 bg-transparent px-4 py-3 text-paper outline-none focus:border-paper"
            />
          </div>
          <div>
            <label htmlFor="password" className="label text-concrete-500">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="mt-2 w-full border border-concrete-700 bg-transparent px-4 py-3 text-paper outline-none focus:border-paper"
            />
          </div>
        </div>

        {error && <p className="label mt-4 text-accent">{error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="display mt-8 w-full bg-paper py-4 text-2xl text-ink transition-opacity hover:bg-accent disabled:opacity-50"
        >
          {pending ? "Checking…" : "Sign in"}
        </button>
      </form>
    </main>
  );
}
