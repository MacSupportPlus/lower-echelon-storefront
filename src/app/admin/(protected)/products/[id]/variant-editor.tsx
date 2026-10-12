"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { addVariant, removeVariant, updateVariantStock } from "../actions";

type Variant = { id: string; size: string; color: string; stock: number };

export function VariantEditor({ productId, variants }: { productId: string; variants: Variant[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [stocks, setStocks] = useState(() => Object.fromEntries(variants.map((v) => [v.id, v.stock])));

  function saveStock(id: string) {
    startTransition(async () => {
      await updateVariantStock(id, stocks[id] ?? 0);
      router.refresh();
    });
  }

  function remove(id: string) {
    startTransition(async () => {
      await removeVariant(productId, id);
      router.refresh();
    });
  }

  function add() {
    setError(null);
    startTransition(async () => {
      const res = await addVariant(productId, size, color);
      if (res?.error) {
        setError(res.error);
        return;
      }
      setSize("");
      setColor("");
      router.refresh();
    });
  }

  return (
    <div className="mt-4">
      {variants.length === 0 && <p className="label text-concrete-500">No sizes/colors yet — add one below.</p>}

      <div className="space-y-2">
        {variants.map((v) => (
          <div key={v.id} className="label flex items-center gap-3">
            <span className="w-16 text-paper">{v.size}</span>
            <span className="w-28 text-concrete-500">{v.color || "—"}</span>
            <input
              type="number"
              min={0}
              value={stocks[v.id] ?? 0}
              onChange={(e) => setStocks((s) => ({ ...s, [v.id]: Number(e.target.value) }))}
              onBlur={() => saveStock(v.id)}
              className="w-20 border border-concrete-700 bg-transparent px-2 py-1 text-paper outline-none focus:border-paper"
            />
            <span className="text-concrete-500">in stock</span>
            <button onClick={() => remove(v.id)} disabled={pending} className="ml-auto underline hover:text-accent">
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="label mt-5 flex items-end gap-3">
        <div>
          <label className="block text-concrete-500">Size</label>
          <input
            value={size}
            onChange={(e) => setSize(e.target.value)}
            placeholder="M"
            className="mt-1 w-20 border border-concrete-700 bg-transparent px-2 py-1 text-paper outline-none focus:border-paper"
          />
        </div>
        <div>
          <label className="block text-concrete-500">Color (optional)</label>
          <input
            value={color}
            onChange={(e) => setColor(e.target.value)}
            placeholder="Black"
            className="mt-1 w-32 border border-concrete-700 bg-transparent px-2 py-1 text-paper outline-none focus:border-paper"
          />
        </div>
        <button
          onClick={add}
          disabled={pending || !size.trim()}
          className="border border-paper px-4 py-1.5 hover:bg-paper hover:text-ink disabled:opacity-50"
        >
          + Add
        </button>
      </div>
      {error && <p className="label mt-2 text-accent">{error}</p>}
    </div>
  );
}
