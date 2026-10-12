"use client";

import { useState, useTransition } from "react";

type Initial = {
  name: string;
  category: string;
  price: number;
  description: string;
  details: string;
  active: boolean;
};

// useTransition + direct call, not useActionState + <form action> — see the comment
// in admin/login/page.tsx for why.
export function ProductForm({
  productId,
  initial,
  action,
}: {
  productId: string;
  initial: Initial;
  action: (productId: string, formData: FormData) => Promise<{ error: string | null }>;
}) {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<{ error: string | null } | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      setResult(await action(productId, formData));
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <Field label="Name" name="name" defaultValue={initial.name} required />
      <div className="grid grid-cols-2 gap-4">
        <Field label="Category" name="category" defaultValue={initial.category} required />
        <Field label="Price (USD)" name="price" type="number" step="0.01" min="0" defaultValue={initial.price} required />
      </div>
      <div>
        <label htmlFor="description" className="label text-concrete-500">Description</label>
        <textarea
          id="description"
          name="description"
          rows={2}
          defaultValue={initial.description}
          className="mt-2 w-full border border-concrete-700 bg-transparent px-4 py-3 text-paper outline-none focus:border-paper"
        />
      </div>
      <div>
        <label htmlFor="details" className="label text-concrete-500">Bullet points (one per line)</label>
        <textarea
          id="details"
          name="details"
          rows={4}
          defaultValue={initial.details}
          className="mt-2 w-full border border-concrete-700 bg-transparent px-4 py-3 text-paper outline-none focus:border-paper"
        />
      </div>
      <label className="label flex items-center gap-2 text-concrete-500">
        <input type="checkbox" name="active" defaultChecked={initial.active} className="accent-accent" />
        Visible on the site
      </label>

      {result?.error && <p className="label text-accent">{result.error}</p>}
      {result && !result.error && <p className="label text-accent">Saved.</p>}

      <button
        type="submit"
        disabled={pending}
        className="display bg-paper px-8 py-3 text-xl text-ink transition-opacity hover:bg-accent disabled:opacity-50"
      >
        {pending ? "Saving…" : "Save"}
      </button>
    </form>
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
