import Image from "next/image";
import Link from "next/link";
import { CartButton } from "./cart-drawer";

export function Header() {
  return (
    <header
      style={{ viewTransitionName: "site-header" }}
      className="fixed inset-x-0 top-0 z-50 flex items-center justify-between bg-gradient-to-b from-ink/90 via-ink/50 to-transparent px-5 pb-6 pt-4 md:px-8"
    >
      <Link href="/" aria-label="Lower Echelon Worldwide — home" className="block">
        <Image
          src="/logo.jpg"
          alt="Lower Echelon Worldwide"
          width={750}
          height={605}
          priority
          className="h-16 w-auto mix-blend-screen"
        />
      </Link>
      <nav className="label flex items-center gap-6">
        <Link href="/shop" className="hover:text-accent">Shop</Link>
        <CartButton />
      </nav>
    </header>
  );
}
