import { ViewTransition } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AddToCart } from "@/components/add-to-cart";
import { ProductPlate } from "@/components/product-plate";
import { Footer } from "@/components/footer";
import { formatPrice, getProduct } from "@/lib/catalog";

// Rendered per-request, not pre-built: the catalog is a live database an owner edits
// from the admin, so a baked-at-build-time page would hide their changes until redeploy.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/product/[slug]">): Promise<Metadata> {
  const product = await getProduct((await params).slug);
  return { title: product?.name ?? "Not found", description: product?.details.join(" · ") || undefined };
}

const pageTransition = {
  enter: { "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" },
  exit: { "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" },
} as const;

export default async function ProductPage({ params }: PageProps<"/product/[slug]">) {
  const product = await getProduct((await params).slug);
  if (!product) notFound();

  return (
    <ViewTransition {...pageTransition} default="none">
      <main className="px-5 pt-24 md:px-8">
        <Link href="/shop" transitionTypes={["nav-back"]} className="label hover:text-accent">
          ← Back to the lobby
        </Link>

        <div className="mt-6 grid gap-10 md:grid-cols-[1.3fr_1fr] md:gap-16">
          <div className="space-y-4">
            <ViewTransition name={`product-${product.slug}`} share="morph" default="none">
              <div>
                <ProductPlate product={product} priority sizes="(min-width: 768px) 52vw, 100vw" />
              </div>
            </ViewTransition>
            {product.images.length > 1 && (
              <div className="grid grid-cols-2 gap-4">
                {product.images.slice(1).map((_, i) => (
                  <div key={i} className="reveal">
                    <ProductPlate product={product} index={i + 1} sizes="(min-width: 768px) 26vw, 50vw" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="md:sticky md:top-24 md:self-start md:pt-8">
            <p className="label text-concrete-500">Unit {product.unit} · {product.category}</p>
            <h1 className="display mt-3 text-5xl md:text-7xl">{product.name}</h1>
            <p className="label mt-5 text-lg text-paper">{formatPrice(product.price)}</p>
            {product.details.length > 0 && (
              <ul className="label mt-6 max-w-md space-y-1 text-concrete-300">
                {product.details.map((d) => (
                  <li key={d}>— {d}</li>
                ))}
              </ul>
            )}
            <div className="mt-10 max-w-md">
              <AddToCart slug={product.slug} sizes={product.sizes} colors={product.colors} soldOut={product.soldOut} />
            </div>
          </div>
        </div>

        <div className="mt-28">
          <Footer />
        </div>
      </main>
    </ViewTransition>
  );
}
