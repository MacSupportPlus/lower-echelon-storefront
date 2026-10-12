import { Header } from "@/components/header";
import { CartDrawer } from "@/components/cart-drawer";
import { SmoothScroll } from "@/components/smooth-scroll";
import { getProducts } from "@/lib/catalog";

// Storefront-only chrome (public pages), kept out of /admin — see the note in the root layout.
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const products = await getProducts();
  const catalog = Object.fromEntries(products.map((p) => [p.slug, { name: p.name, price: p.price, image: p.images[0] }]));
  return (
    <div className="grain">
      <SmoothScroll />
      <Header />
      <CartDrawer catalog={catalog} />
      {children}
    </div>
  );
}
