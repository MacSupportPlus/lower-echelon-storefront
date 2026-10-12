import Link from "next/link";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Pending",
  PAID: "Paid",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  REFUNDED: "Refunded",
};

export default async function AdminOrdersPage() {
  const orders = await db.selectFrom("Order").selectAll().orderBy("createdAt", "desc").execute();

  return (
    <div>
      <h1 className="display text-5xl">Orders</h1>

      {orders.length === 0 ? (
        <p className="label mt-8 text-concrete-500">
          No orders yet. Once Stripe checkout is live, paid orders will show up here automatically.
        </p>
      ) : (
        <div className="mt-8 overflow-x-auto">
          <table className="label w-full min-w-[720px] text-left">
            <thead className="text-concrete-500">
              <tr className="border-b border-concrete-700">
                <th className="py-3 pr-4">Order</th>
                <th className="py-3 pr-4">Date</th>
                <th className="py-3 pr-4">Customer</th>
                <th className="py-3 pr-4">Status</th>
                <th className="py-3 pr-4">Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-concrete-700/50">
                  <td className="py-3 pr-4 text-paper">
                    <Link href={`/admin/orders/${o.id}`} className="hover:text-accent">
                      #{o.number}
                    </Link>
                  </td>
                  <td className="py-3 pr-4">{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td className="py-3 pr-4">{o.email}</td>
                  <td className="py-3 pr-4">
                    <span className={o.status === "PENDING" ? "text-concrete-500" : ""}>
                      {STATUS_LABEL[o.status] ?? o.status}
                    </span>
                  </td>
                  <td className="py-3 pr-4">${(o.total / 100).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
