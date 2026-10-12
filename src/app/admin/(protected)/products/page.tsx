import Link from "next/link";
import { db } from "@/lib/db";
import { toggleActive } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage({ searchParams }: { searchParams: Promise<{ stock?: string }> }) {
  const { stock } = await searchParams;
  const soldOutOnly = stock === "out";

  const products = await db.selectFrom("Product").selectAll().orderBy("createdAt", "asc").execute();
  const variants = await db.selectFrom("ProductVariant").select(["productId", "stock"]).execute();

  const stockByProduct = new Map<string, number>();
  for (const v of variants) stockByProduct.set(v.productId, (stockByProduct.get(v.productId) ?? 0) + v.stock);

  const visible = soldOutOnly ? products.filter((p) => (stockByProduct.get(p.id) ?? 0) <= 0) : products;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="display text-5xl">Products</h1>
        <Link href="/admin/products/new" className="label border border-paper px-4 py-2 hover:bg-paper hover:text-ink">
          + New product
        </Link>
      </div>

      {soldOutOnly && (
        <p className="label mt-4 text-concrete-500">
          Showing sold-out products only — <Link href="/admin/products" className="underline hover:text-accent">clear filter</Link>
        </p>
      )}

      <div className="mt-8 overflow-x-auto">
        <table className="label w-full min-w-[720px] text-left">
          <thead className="text-concrete-500">
            <tr className="border-b border-concrete-700">
              <th className="py-3 pr-4">Name</th>
              <th className="py-3 pr-4">Category</th>
              <th className="py-3 pr-4">Price</th>
              <th className="py-3 pr-4">Stock</th>
              <th className="py-3 pr-4">Status</th>
              <th className="py-3 pr-4"></th>
            </tr>
          </thead>
          <tbody>
            {visible.map((p) => {
              const stockTotal = stockByProduct.get(p.id) ?? 0;
              return (
                <tr key={p.id} className="border-b border-concrete-700/50">
                  <td className="py-3 pr-4 text-paper">
                    <Link href={`/admin/products/${p.id}`} className="hover:text-accent">{p.name}</Link>
                  </td>
                  <td className="py-3 pr-4">{p.category}</td>
                  <td className="py-3 pr-4">${(p.price / 100).toFixed(0)}</td>
                  <td className="py-3 pr-4">{stockTotal <= 0 ? <span className="text-accent">0</span> : stockTotal}</td>
                  <td className="py-3 pr-4">{p.active ? "Live" : "Hidden"}</td>
                  <td className="py-3 pr-4">
                    <form action={toggleActive.bind(null, p.id, !p.active)}>
                      <button type="submit" className="underline hover:text-accent">
                        {p.active ? "Hide" : "Unhide"}
                      </button>
                    </form>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {visible.length === 0 && <p className="label mt-6 text-concrete-500">Nothing sold out right now.</p>}
      </div>
    </div>
  );
}
