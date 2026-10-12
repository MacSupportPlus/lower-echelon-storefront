import { ViewTransition } from "react";
import Link from "next/link";
import { formatPrice, type ProductWithUnit } from "@/lib/catalog";
import { ProductPlate } from "./product-plate";

export function ProductCard({ product, priority }: { product: ProductWithUnit; priority?: boolean }) {
  return (
    <Link
      href={`/product/${product.slug}`}
      transitionTypes={["nav-forward"]}
      className="group block"
    >
      <ViewTransition name={`product-${product.slug}`} share="morph" default="none">
        <div className="relative overflow-hidden">
          <ProductPlate
            product={product}
            priority={priority}
            hoverSwap
            className="transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
          />
          {product.soldOut && (
            <span className="label absolute right-3 top-3 bg-paper px-2 py-1 text-ink">
              Vacancy: none
            </span>
          )}
        </div>
      </ViewTransition>
      <div className="mt-3 flex items-baseline justify-between gap-4">
        <div>
          <p className="label text-concrete-500">Unit {product.unit}</p>
          <h3 className="mt-1 text-sm font-medium uppercase tracking-wide">{product.name}</h3>
        </div>
        <p className="label shrink-0 text-paper">{formatPrice(product.price)}</p>
      </div>
    </Link>
  );
}
