"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createProduct } from "../actions";

// useTransition + direct call, not useActionState + <form action> — see the comment
// in admin/login/page.tsx for why: that combo only dispatches the action once per
// page load and silently stops responding to further submit clicks after an error.
export default function NewProductPage() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await createProduct(formData);
      // createProduct redirects server-side on success, so reaching here means an error.
      if (res?.error) setError(res.error);
      else router.refresh();
    });
  }

  return (
    <div className="max-w-lg">
      <Link href="/admin/products" className="label text-concrete-500 hover:text-accent">← Products</Link>
      <h1 className="display mt-3 text-5xl">New product</h1>

      <form onSubmit={onSubmit} className="mt-8 space-y-5">
        <Field label="Slug (used in the URL, e.g. og-hoodie-v2)" name="slug" required pattern="[a-z0-9-]+" />
        <Field label="Name" name="name" required />
        <Field label="Category" name="category" required />
        <Field label="Price (USD)" name="price" type="number" step="0.01" min="0" required />

        {error && <p className="label text-accent">{error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="display w-full bg-paper py-4 text-2xl text-ink transition-opacity hover:bg-accent disabled:opacity-50"
        >
          {pending ? "Creating…" : "Create product"}
        </button>
        <p className="label text-concrete-500">You can add sizes, colors and photos on the next screen.</p>
      </form>
    </div>
  );
}

function Field(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string; name: string }) {
  const { label, name, ...rest } = props;
  return (
    <div>
      <label htmlFor={name} className="label text-concrete-500">{label}</label>
      <input
        id={name}
        name={name}
        {...rest}
        className="mt-2 w-full border border-concrete-700 bg-transparent px-4 py-3 text-paper outline-none focus:border-paper"
      />
    </div>
  );
}
