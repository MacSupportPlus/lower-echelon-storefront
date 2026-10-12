import Link from "next/link";
import { db } from "@/lib/db";

export default async function AdminDashboard() {
  const [products, variants, orders] = await Promise.all([
    db.selectFrom("Product").select(db.fn.countAll().as("n")).executeTakeFirst(),
    db.selectFrom("ProductVariant").select(["productId", "stock"]).execute(),
    db.selectFrom("Order").select(db.fn.countAll().as("n")).executeTakeFirst(),
  ]);

  // "Sold out" means the whole product has nothing left across any size/color — same
  // definition the products list uses when filtered, and what the storefront shows as
  // sold out. Not the same as a single out-of-stock variant within an otherwise-OK product.
  const stockByProduct = new Map<string, number>();
  for (const v of variants) stockByProduct.set(v.productId, (stockByProduct.get(v.productId) ?? 0) + v.stock);
  const soldOutCount = [...stockByProduct.values()].filter((total) => total <= 0).length;

  const stats = [
    { label: "Products", value: products?.n ?? 0, href: "/admin/products" },
    { label: "Sold-out products", value: soldOutCount, href: "/admin/products?stock=out" },
    { label: "Orders", value: orders?.n ?? 0, href: "/admin/orders" },
  ];

  return (
    <div>
      <h1 className="display text-5xl">Dashboard</h1>
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="border border-concrete-700 p-6 hover:border-paper">
            <p className="display text-4xl">{String(s.value)}</p>
            <p className="label mt-2 text-concrete-500">{s.label}</p>
          </Link>
        ))}
      </div>
      <p className="label mt-10 text-concrete-500">
        Real orders start flowing in once Stripe checkout goes live (Stage 2) — this screen and the
        orders list are already built and ready for them.
      </p>
    </div>
  );
}
