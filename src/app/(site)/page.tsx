import { ViewTransition } from "react";
import Link from "next/link";
import { Hero } from "@/components/hero";
import { DropRail } from "@/components/drop-rail";
import { ProductCard } from "@/components/product-card";
import { Footer } from "@/components/footer";
import { getCategories, getProducts } from "@/lib/catalog";

const MARQUEE = "We hope you enjoy your stay ✦ Lower Echelon Worldwide ✦ Est. 2020 ✦ New York ✦ ";

// Live database an owner edits from the admin — render per-request, not baked at build time.
export const dynamic = "force-dynamic";

const pageTransition = {
  enter: { "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" },
  exit: { "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" },
} as const;

export default async function Home() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);
  const drop = products.slice(0, 6);

  return (
    <ViewTransition {...pageTransition} default="none">
      <main>
        <Hero />

        <div className="overflow-hidden border-y border-concrete-700 py-4" aria-hidden>
          <div className="marquee-track label whitespace-pre text-concrete-300">
            <span>{MARQUEE.repeat(6)}</span>
            <span>{MARQUEE.repeat(6)}</span>
          </div>
        </div>

        <DropRail>
          {drop.map((p, i) => (
            <div key={p.slug} className="w-[72vw] shrink-0 snap-start md:w-[28vw]">
              <ProductCard product={p} priority={i < 2} />
            </div>
          ))}
          <Link
            href="/shop"
            transitionTypes={["nav-forward"]}
            className="display grid w-[72vw] shrink-0 place-items-center bg-accent text-5xl text-ink md:w-[22vw] md:text-6xl"
          >
            <span className="p-6 text-center">See all<br />{products.length} units →</span>
          </Link>
        </DropRail>

        <section className="px-5 py-28 md:px-8">
          <h2 className="display reveal text-6xl md:text-8xl">Pick a floor</h2>
          <ul className="mt-12 divide-y divide-concrete-700 border-y border-concrete-700">
            {categories.map((c, i) => (
              <li key={c} className="reveal">
                <Link
                  href={`/shop?category=${encodeURIComponent(c)}`}
                  transitionTypes={["nav-forward"]}
                  className="group flex items-baseline justify-between py-5 transition-colors hover:bg-paper hover:text-ink md:px-4"
                >
                  <span className="display text-4xl md:text-7xl">{c}</span>
                  <span className="label text-concrete-500 group-hover:text-ink">
                    Floor {String(i + 1).padStart(2, "0")} →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <Footer />
      </main>
    </ViewTransition>
  );
}
