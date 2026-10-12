"use client";

import { useSyncExternalStore } from "react";
import Image from "next/image";
import { useCart } from "@/lib/cart";

type CatalogEntry = { name: string; price: number; image?: string };

const subscribe = () => () => {};
const useHydrated = () =>
  useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

// Trigger button + slide-in drawer built on the native popover API (no JS open/close state).
export function CartButton() {
  const hydrated = useHydrated();
  const count = useCart((s) => s.lines.reduce((n, l) => n + l.qty, 0));
  return (
    <button popoverTarget="cart-drawer" className="label flex items-center gap-2 hover:text-accent">
      Your Stay
      <span className="grid h-5 min-w-5 place-items-center bg-paper px-1 text-ink">
        {hydrated ? count : 0}
      </span>
    </button>
  );
}

export function CartDrawer({ catalog }: { catalog: Record<string, CatalogEntry> }) {
  const { lines, setQty, remove } = useCart();
  const hydrated = useHydrated();
  const visible = hydrated ? lines.filter((l) => catalog[l.slug]) : [];
  const subtotal = visible.reduce((sum, l) => sum + catalog[l.slug].price * l.qty, 0);

  return (
    <div id="cart-drawer" popover="auto" className="cart-drawer">
      <div className="flex h-full flex-col p-6">
        <div className="flex items-center justify-between">
          <h2 className="display text-4xl">Your Stay</h2>
          <button popoverTarget="cart-drawer" popoverTargetAction="hide" className="label hover:text-accent">
            Close ✕
          </button>
        </div>

        <div className="mt-8 flex-1 space-y-5 overflow-y-auto">
          {visible.length === 0 && (
            <p className="label text-concrete-500">Nothing booked yet. Take a look around.</p>
          )}
          {visible.map((l) => (
            <div key={`${l.slug}-${l.size}-${l.color}`} className="flex items-start justify-between gap-4 border-b border-concrete-700 pb-5">
              {catalog[l.slug].image && (
                <Image src={catalog[l.slug].image!} alt="" width={64} height={80} className="h-20 w-16 shrink-0 object-cover" />
              )}
              <div className="flex-1">
                <p className="text-sm font-medium uppercase">{catalog[l.slug].name}</p>
                <p className="label mt-1 text-concrete-500">{[l.color, `Size ${l.size}`].filter(Boolean).join(" · ")}</p>
                <div className="label mt-3 flex items-center gap-3">
                  <button aria-label="Decrease quantity" onClick={() => setQty(l.slug, l.size, l.color, l.qty - 1)} className="h-6 w-6 border border-concrete-500 hover:border-accent hover:text-accent">−</button>
                  <span>{l.qty}</span>
                  <button aria-label="Increase quantity" onClick={() => setQty(l.slug, l.size, l.color, l.qty + 1)} className="h-6 w-6 border border-concrete-500 hover:border-accent hover:text-accent">+</button>
                  <button onClick={() => remove(l.slug, l.size, l.color)} className="ml-3 text-concrete-500 underline hover:text-accent">Remove</button>
                </div>
              </div>
              <p className="label">${catalog[l.slug].price * l.qty}</p>
            </div>
          ))}
        </div>

        <div className="border-t border-concrete-700 pt-5">
          <div className="label flex justify-between">
            <span>Subtotal</span>
            <span>${subtotal}</span>
          </div>
          <button
            disabled={visible.length === 0}
            className="display mt-5 w-full bg-accent py-4 text-2xl text-ink transition-opacity disabled:opacity-30"
          >
            Check out
          </button>
          <p className="label mt-3 text-concrete-500">Checkout goes live in Stage 2 (Stripe).</p>
        </div>
      </div>
    </div>
  );
}
