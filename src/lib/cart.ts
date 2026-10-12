"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartLine = { slug: string; size: string; color: string; qty: number };

type CartState = {
  lines: CartLine[];
  add: (slug: string, size: string, color: string) => void;
  setQty: (slug: string, size: string, color: string, qty: number) => void;
  remove: (slug: string, size: string, color: string) => void;
  clear: () => void;
};

const same = (l: CartLine, slug: string, size: string, color: string) =>
  l.slug === slug && l.size === size && l.color === color;

// Cart holds only ids/size/color/qty. Prices are always re-read from the catalog (and, in Stage 2,
// re-validated server-side before creating a Stripe Checkout session).
export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      add: (slug, size, color) =>
        set((s) =>
          s.lines.some((l) => same(l, slug, size, color))
            ? { lines: s.lines.map((l) => (same(l, slug, size, color) ? { ...l, qty: l.qty + 1 } : l)) }
            : { lines: [...s.lines, { slug, size, color, qty: 1 }] },
        ),
      setQty: (slug, size, color, qty) =>
        set((s) => ({
          lines: s.lines
            .map((l) => (same(l, slug, size, color) ? { ...l, qty } : l))
            .filter((l) => l.qty > 0),
        })),
      remove: (slug, size, color) =>
        set((s) => ({ lines: s.lines.filter((l) => !same(l, slug, size, color)) })),
      clear: () => set({ lines: [] }),
    }),
    {
      name: "le-cart",
      version: 2,
      // v1 carts had no color field; drop them rather than render broken lines.
      migrate: () => ({ lines: [] }),
    },
  ),
);
