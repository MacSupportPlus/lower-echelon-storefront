import Image from "next/image";
import type { ProductWithUnit } from "@/lib/catalog";

const TONES = ["#1d1d1b", "#262623", "#191918", "#2d2c29"];
const SIZES = "(min-width: 1024px) 28vw, (min-width: 768px) 40vw, 72vw";

// Shows the real photo when one exists (second photo fades in on hover when `hoverSwap` is set);
// otherwise a concrete "plate" stenciled with the unit number.
export function ProductPlate({
  product,
  index = 0,
  priority = false,
  hoverSwap = false,
  sizes = SIZES,
  className = "",
}: {
  product: ProductWithUnit;
  index?: number;
  priority?: boolean;
  hoverSwap?: boolean;
  sizes?: string;
  className?: string;
}) {
  const src = product.images[index];
  const alt = product.images[1];
  return (
    <div
      className={`relative aspect-[4/5] w-full overflow-hidden ${className}`}
      style={{ background: TONES[Number(product.unit) % TONES.length] }}
    >
      {src ? (
        <>
          <Image src={src} alt={product.name} fill priority={priority} sizes={sizes} className="object-cover" />
          {hoverSwap && alt && (
            <Image
              src={alt}
              alt=""
              fill
              sizes={sizes}
              className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
          )}
        </>
      ) : (
        <>
          <span
            aria-hidden
            className="display absolute -bottom-[0.12em] -right-[0.04em] select-none text-[42vw] leading-none text-paper/[0.06] md:text-[14rem]"
          >
            {product.unit}
          </span>
          <span className="label absolute left-3 top-3 text-concrete-500">Photo pending</span>
        </>
      )}
    </div>
  );
}
