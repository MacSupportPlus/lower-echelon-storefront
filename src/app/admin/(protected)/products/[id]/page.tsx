import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { updateProduct, deleteProduct } from "../actions";
import { ProductForm } from "./product-form";
import { VariantEditor } from "./variant-editor";
import { ImageEditor } from "./image-editor";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await db.selectFrom("Product").selectAll().where("id", "=", id).executeTakeFirst();
  if (!product) notFound();

  const [variants, images] = await Promise.all([
    db.selectFrom("ProductVariant").selectAll().where("productId", "=", id).execute(),
    db.selectFrom("ProductImage").selectAll().where("productId", "=", id).orderBy("position", "asc").execute(),
  ]);

  return (
    <div className="max-w-5xl">
      <Link href="/admin/products" className="label text-concrete-500 hover:text-accent">← Products</Link>
      <div className="mt-3 flex items-baseline justify-between">
        <h1 className="display text-5xl">{product.name}</h1>
        <form
          action={async () => {
            "use server";
            await deleteProduct(product.id);
          }}
        >
          <button type="submit" className="label text-concrete-500 underline hover:text-accent">
            Delete product
          </button>
        </form>
      </div>
      <p className="label mt-1 text-concrete-500">/{product.slug}</p>

      <div className="mt-8 grid grid-cols-1 gap-x-12 gap-y-12 lg:grid-cols-2">
        <div>
          <ProductForm
            productId={product.id}
            initial={{
              name: product.name,
              category: product.category,
              price: product.price / 100,
              description: product.description,
              details: product.details.join("\n"),
              active: product.active,
            }}
            action={updateProduct}
          />
        </div>

        <div className="space-y-12 lg:border-l lg:border-concrete-700 lg:pl-12">
          <div>
            <h2 className="label text-concrete-500">Sizes, colors & stock</h2>
            <VariantEditor productId={product.id} variants={variants} />
          </div>

          <div className="border-t border-concrete-700 pt-8 lg:border-t-0 lg:pt-0">
            <h2 className="label text-concrete-500">Photos</h2>
            <ImageEditor productId={product.id} images={images} />
          </div>
        </div>
      </div>
    </div>
  );
}
