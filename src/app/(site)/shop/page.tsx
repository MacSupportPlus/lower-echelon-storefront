import { ViewTransition } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { ProductCard } from "@/components/product-card";
import { Footer } from "@/components/footer";
import { getCategories, getProducts, type Category } from "@/lib/catalog";

export const metadata: Metadata = { title: "Shop" };

const pageTransition = {
  enter: { "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" },
  exit: { "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" },
} as const;

export default async function ShopPage({ searchParams }: PageProps<"/shop">) {
  const { category } = await searchParams;
  const categories = await getCategories();
  const active = categories.find((c) => c === category) as Category | undefined;
  const products = await getProducts(active);

  return (
    <ViewTransition {...pageTransition} default="none">
      <main className="px-5 pt-28 md:px-8">
        <h1 className="display text-7xl md:text-[10rem]">{active ?? "All units"}</h1>

        <nav aria-label="Categories" className="label mt-8 flex flex-wrap gap-2">
          {[undefined, ...categories].map((c) => (
            <Link
              key={c ?? "all"}
              href={c ? `/shop?category=${encodeURIComponent(c)}` : "/shop"}
              className={`border px-3 py-2 transition-colors ${
                c === active
                  ? "border-accent bg-accent text-ink"
                  : "border-concrete-700 hover:border-paper"
              }`}
            >
              {c ?? "All"}
            </Link>
          ))}
        </nav>

        <ViewTransition key={active ?? "all"} name="shop-grid" share="auto" enter="auto" default="none">
          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </ViewTransition>

        <div className="mt-28">
          <Footer />
        </div>
      </main>
    </ViewTransition>
  );
}
