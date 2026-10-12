"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart";

const chip = (on: boolean) =>
  `label border px-4 py-3 transition-all active:scale-95 disabled:opacity-30 ${
    on ? "border-accent bg-accent text-ink" : "border-concrete-700 hover:border-paper"
  }`;

export function AddToCart({
  slug,
  sizes,
  colors,
  soldOut,
}: {
  slug: string;
  sizes: string[];
  colors: string[];
  soldOut: boolean;
}) {
  const add = useCart((s) => s.add);
  const [size, setSize] = useState<string | null>(sizes.length === 1 ? sizes[0] : null);
  const [color, setColor] = useState<string | null>(colors.length === 0 ? "" : null);
  const [added, setAdded] = useState(false);
  const ready = size !== null && color !== null;

  function onAdd() {
    if (size === null || color === null) return;
    add(slug, size, color);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
    document.getElementById("cart-drawer")?.showPopover?.();
  }

  return (
    <div className="space-y-7">
      {colors.length > 0 && (
        <div>
          <p className="label text-concrete-500">Color{color ? ` — ${color}` : ""}</p>
          <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-label="Color">
            {colors.map((c) => (
              <button key={c} role="radio" aria-checked={color === c} disabled={soldOut} onClick={() => setColor(c)} className={chip(color === c)}>
                {c}
              </button>
            ))}
          </div>
        </div>
      )}
      <div>
        <p className="label text-concrete-500">Size</p>
        <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-label="Size">
          {sizes.map((s) => (
            <button key={s} role="radio" aria-checked={size === s} disabled={soldOut} onClick={() => setSize(s)} className={`${chip(size === s)} min-w-14`}>
              {s}
            </button>
          ))}
        </div>
      </div>
      <button
        onClick={onAdd}
        disabled={soldOut || !ready}
        className="display w-full bg-paper py-5 text-3xl text-ink transition-all hover:bg-accent active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-paper"
      >
        {soldOut ? "Vacancy: none" : added ? "Booked ✓" : ready ? "Book it" : colors.length && !color ? "Pick a color" : "Pick a size"}
      </button>
    </div>
  );
}
