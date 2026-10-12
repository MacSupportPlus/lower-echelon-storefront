"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { OrderStatus } from "@/generated/kysely/enums";

export async function updateOrderStatus(orderId: string, status: string) {
  if (!Object.values(OrderStatus).includes(status as OrderStatus)) {
    return { error: "Not a valid status." };
  }
  await db
    .updateTable("Order")
    .set({ status: status as OrderStatus, updatedAt: new Date() })
    .where("id", "=", orderId)
    .execute();
  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin/orders");
  return { error: null };
}

export async function setTracking(orderId: string, trackingCarrier: string, trackingNumber: string) {
  await db
    .updateTable("Order")
    .set({
      trackingCarrier: trackingCarrier.trim() || null,
      trackingNumber: trackingNumber.trim() || null,
      updatedAt: new Date(),
    })
    .where("id", "=", orderId)
    .execute();
  revalidatePath(`/admin/orders/${orderId}`);
  return { error: null };
}
