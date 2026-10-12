"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { randomUUID } from "node:crypto";
import { db } from "@/lib/db";

// Every mutation revalidates the public pages too — the whole point of the admin
// is that an edit shows up on the live site immediately (see the "force-dynamic"
// notes on the storefront pages for why that's possible at all).
function revalidateStorefront() {
  revalidatePath("/");
  revalidatePath("/shop");
}

export async function toggleActive(productId: string, active: boolean) {
  await db.updateTable("Product").set({ active, updatedAt: new Date() }).where("id", "=", productId).execute();
  revalidatePath("/admin/products");
  revalidateStorefront();
}

export async function updateProduct(productId: string, formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const priceDollars = Number(formData.get("price"));
  const description = String(formData.get("description") ?? "").trim();
  const details = String(formData.get("details") ?? "")
    .split("\n")
    .map((d) => d.trim())
    .filter(Boolean);
  const active = formData.get("active") === "on";

  if (!name || !category || !Number.isFinite(priceDollars) || priceDollars < 0) {
    return { error: "Name, category and a valid price are required." };
  }

  await db
    .updateTable("Product")
    .set({
      name,
      category,
      price: Math.round(priceDollars * 100),
      description,
      details,
      active,
      updatedAt: new Date(),
    })
    .where("id", "=", productId)
    .execute();

  revalidatePath(`/admin/products/${productId}`);
  revalidatePath("/admin/products");
  revalidateStorefront();
  return { error: null };
}

export async function updateVariantStock(variantId: string, stock: number) {
  const safe = Number.isFinite(stock) && stock >= 0 ? Math.round(stock) : 0;
  await db.updateTable("ProductVariant").set({ stock: safe }).where("id", "=", variantId).execute();
  revalidateStorefront();
}

export async function addVariant(productId: string, size: string, color: string) {
  size = size.trim();
  color = color.trim();
  if (!size) return { error: "Size is required." };
  const exists = await db
    .selectFrom("ProductVariant")
    .select("id")
    .where("productId", "=", productId)
    .where("size", "=", size)
    .where("color", "=", color)
    .executeTakeFirst();
  if (exists) return { error: "That size/color combination already exists." };

  await db.insertInto("ProductVariant").values({ id: randomUUID(), productId, size, color, stock: 0 }).execute();
  revalidatePath(`/admin/products/${productId}`);
  revalidateStorefront();
  return { error: null };
}

export async function removeVariant(productId: string, variantId: string) {
  await db.deleteFrom("ProductVariant").where("id", "=", variantId).execute();
  revalidatePath(`/admin/products/${productId}`);
  revalidateStorefront();
}

export async function addImageUrl(productId: string, url: string) {
  url = url.trim();
  if (!url) return { error: "URL is required." };
  const count = await db
    .selectFrom("ProductImage")
    .select(db.fn.countAll().as("n"))
    .where("productId", "=", productId)
    .executeTakeFirst();
  await db
    .insertInto("ProductImage")
    .values({ id: randomUUID(), productId, url, position: Number(count?.n ?? 0) })
    .execute();
  revalidatePath(`/admin/products/${productId}`);
  revalidateStorefront();
  return { error: null };
}

export async function removeImage(productId: string, imageId: string) {
  await db.deleteFrom("ProductImage").where("id", "=", imageId).execute();
  revalidatePath(`/admin/products/${productId}`);
  revalidateStorefront();
}

export async function createProduct(formData: FormData) {
  const slug = String(formData.get("slug") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const priceDollars = Number(formData.get("price"));

  if (!slug || !name || !category || !Number.isFinite(priceDollars) || priceDollars < 0) {
    return { error: "Slug, name, category and a valid price are required." };
  }
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return { error: "Slug can only contain lowercase letters, numbers and hyphens." };
  }
  const exists = await db.selectFrom("Product").select("id").where("slug", "=", slug).executeTakeFirst();
  if (exists) return { error: "That slug is already in use." };

  const id = randomUUID();
  await db
    .insertInto("Product")
    .values({
      id,
      slug,
      name,
      category,
      price: Math.round(priceDollars * 100),
      description: "",
      details: [],
      active: true,
    })
    .execute();

  revalidatePath("/admin/products");
  revalidateStorefront();
  redirect(`/admin/products/${id}`);
}

export async function deleteProduct(productId: string) {
  await db.deleteFrom("Product").where("id", "=", productId).execute();
  revalidatePath("/admin/products");
  revalidateStorefront();
  redirect("/admin/products");
}
