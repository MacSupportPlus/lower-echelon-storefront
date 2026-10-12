import { db } from "@/lib/db";

// Data layer, backed by Postgres (Neon) via Kysely — see src/lib/db.ts and prisma/schema.prisma.
// Category is a free-form string (not a fixed union) so the owner can add one from the admin
// without a code change.
export type Category = string;

export type Product = {
  slug: string;
  name: string;
  price: number; // dollars, for display — stored as cents in the DB
  category: Category;
  soldOut: boolean;
  sizes: string[];
  colors: string[];
  images: string[];
  details: string[];
};

export type ProductWithUnit = Product & { unit: string };

const SIZE_ORDER = ["S", "M", "L", "XL", "XXL"];
const bySize = (a: string, b: string) => {
  const ia = SIZE_ORDER.indexOf(a);
  const ib = SIZE_ORDER.indexOf(b);
  if (ia === -1 && ib === -1) return a.localeCompare(b);
  if (ia === -1) return 1;
  if (ib === -1) return -1;
  return ia - ib;
};

// A product's "unit" number reflects its position in the whole active catalog, so it stays
// stable across category filters — fetching everything is cheap at this catalog's size.
async function loadAllProducts(): Promise<ProductWithUnit[]> {
  const rows = await db.selectFrom("Product").selectAll().where("active", "=", true).orderBy("createdAt", "asc").execute();
  if (rows.length === 0) return [];

  const ids = rows.map((r) => r.id);
  const [images, variants] = await Promise.all([
    db.selectFrom("ProductImage").selectAll().where("productId", "in", ids).orderBy("position", "asc").execute(),
    db.selectFrom("ProductVariant").selectAll().where("productId", "in", ids).execute(),
  ]);

  return rows.map((row, i): ProductWithUnit => {
    const myVariants = variants.filter((v) => v.productId === row.id);
    const sizes = [...new Set(myVariants.map((v) => v.size))].sort(bySize);
    const colors = [...new Set(myVariants.map((v) => v.color).filter((c) => c !== ""))];
    const totalStock = myVariants.reduce((sum, v) => sum + v.stock, 0);
    return {
      slug: row.slug,
      name: row.name,
      price: row.price / 100,
      category: row.category,
      soldOut: myVariants.length > 0 && totalStock <= 0,
      sizes,
      colors,
      images: images.filter((im) => im.productId === row.id).map((im) => im.url),
      details: row.details,
      unit: String(i + 1).padStart(2, "0"),
    };
  });
}

export async function getProducts(category?: Category): Promise<ProductWithUnit[]> {
  const all = await loadAllProducts();
  return category ? all.filter((p) => p.category === category) : all;
}

export async function getProduct(slug: string): Promise<ProductWithUnit | undefined> {
  return (await loadAllProducts()).find((p) => p.slug === slug);
}

export async function getCategories(): Promise<Category[]> {
  const rows = await db
    .selectFrom("Product")
    .select("category")
    .distinct()
    .where("active", "=", true)
    .orderBy("category", "asc")
    .execute();
  return rows.map((r) => r.category);
}

export const formatPrice = (n: number) => `$${n.toFixed(0)}`;
