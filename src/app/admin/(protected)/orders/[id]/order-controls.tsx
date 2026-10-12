"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateOrderStatus, setTracking } from "../actions";
import { OrderStatus } from "@/generated/kysely/enums";

export function OrderControls({
  orderId,
  status,
  trackingCarrier,
  trackingNumber,
}: {
  orderId: string;
  status: string;
  trackingCarrier: string;
  trackingNumber: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [carrier, setCarrier] = useState(trackingCarrier);
  const [number, setNumber] = useState(trackingNumber);

  function onStatusChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value;
    startTransition(async () => {
      await updateOrderStatus(orderId, next);
      router.refresh();
    });
  }

  function saveTracking() {
    startTransition(async () => {
      await setTracking(orderId, carrier, number);
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="status" className="label text-concrete-500">Status</label>
        <select
          id="status"
          defaultValue={status}
          onChange={onStatusChange}
          disabled={pending}
          className="mt-2 w-full border border-concrete-700 bg-ink px-4 py-3 text-paper outline-none focus:border-paper"
        >
          {Object.values(OrderStatus).map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="label text-concrete-500">Tracking</label>
        <div className="mt-2 grid grid-cols-2 gap-3">
          <input
            value={carrier}
            onChange={(e) => setCarrier(e.target.value)}
            placeholder="Carrier (e.g. USPS)"
            className="border border-concrete-700 bg-transparent px-4 py-3 text-paper outline-none focus:border-paper"
          />
          <input
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            placeholder="Tracking number"
            className="border border-concrete-700 bg-transparent px-4 py-3 text-paper outline-none focus:border-paper"
          />
        </div>
        <button
          onClick={saveTracking}
          disabled={pending}
          className="label mt-3 border border-paper px-4 py-2 hover:bg-paper hover:text-ink disabled:opacity-50"
        >
          {pending ? "Saving…" : "Save tracking"}
        </button>
      </div>
    </div>
  );
}
