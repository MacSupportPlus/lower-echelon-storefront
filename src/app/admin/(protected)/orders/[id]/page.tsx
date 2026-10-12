import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { OrderControls } from "./order-controls";

export const dynamic = "force-dynamic";

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await db.selectFrom("Order").selectAll().where("id", "=", id).executeTakeFirst();
  if (!order) notFound();

  const items = await db.selectFrom("OrderItem").selectAll().where("orderId", "=", id).execute();
  const address = order.shippingAddress as {
    line1?: string; line2?: string; city?: string; state?: string; zip?: string; country?: string;
  } | null;

  return (
    <div className="max-w-5xl">
      <Link href="/admin/orders" className="label text-concrete-500 hover:text-accent">← Orders</Link>
      <h1 className="display mt-3 text-5xl">Order #{order.number}</h1>
      <p className="label mt-1 text-concrete-500">
        {new Date(order.createdAt).toLocaleString()} · {order.email}
      </p>

      <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div>
          <h2 className="label text-concrete-500">Items</h2>
          <div className="mt-3 space-y-4">
            {items.map((it) => (
              <div key={it.id} className="label flex items-start justify-between border-b border-concrete-700/50 pb-3">
                <div>
                  <p className="text-paper">{it.productName}</p>
                  <p className="mt-1 text-concrete-500">
                    {[it.color, `Size ${it.size}`].filter(Boolean).join(" · ")} · Qty {it.quantity}
                  </p>
                </div>
                <p>${((it.unitPrice * it.quantity) / 100).toFixed(2)}</p>
              </div>
            ))}
          </div>

          <div className="label mt-6 space-y-1 text-concrete-500">
            <div className="flex justify-between"><span>Subtotal</span><span>${(order.subtotal / 100).toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>${(order.shipping / 100).toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Tax</span><span>${(order.tax / 100).toFixed(2)}</span></div>
            <div className="flex justify-between text-paper"><span>Total</span><span>${(order.total / 100).toFixed(2)}</span></div>
          </div>

          {address && (
            <div className="mt-8">
              <h2 className="label text-concrete-500">Shipping to</h2>
              <p className="label mt-2 text-paper">
                {order.name}<br />
                {address.line1}{address.line2 ? <>, {address.line2}</> : null}<br />
                {address.city}, {address.state} {address.zip}<br />
                {address.country}
              </p>
            </div>
          )}
        </div>

        <div className="lg:border-l lg:border-concrete-700 lg:pl-12">
          <h2 className="label text-concrete-500">Fulfillment</h2>
          <div className="mt-3">
            <OrderControls
              orderId={order.id}
              status={order.status}
              trackingCarrier={order.trackingCarrier ?? ""}
              trackingNumber={order.trackingNumber ?? ""}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
