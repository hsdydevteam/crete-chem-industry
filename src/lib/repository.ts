import "server-only";
import { database } from "./db";
import { seed } from "./seed";
import type { Catalog, CollectionName, Order } from "./types";
import { cache } from "react";
export async function getCatalog(publicOnly = true): Promise<Catalog> {
  const db = await database();
  const entries = await Promise.all(
    (Object.keys(seed) as CollectionName[]).map(async (name) => [
      name,
      await db
        .collection(name)
        .find(publicOnly ? { active: true } : {}, { projection: { _id: 0 } })
        .sort({ name: 1, title: 1 })
        .toArray(),
    ]),
  );
  const data = Object.fromEntries(entries) as Catalog;
  data.products = data.products.map((p) => ({
    ...p,
    serviceIds: data.services
      .filter((s) => s.recommendedProductIds.includes(p.id))
      .map((s) => s.id),
  }));
  return data;
}
export const publicCatalog = cache(async (): Promise<Catalog> => {
  try {
    return await getCatalog();
  } catch {
    console.error("Catalog database unavailable");
    return structuredClone(seed);
  }
});
export function orderView(row: Record<string, unknown>): Order {
  return {
    id: String(row.id),
    createdAt: Number(row.created_at),
    status: String(row.status),
    customer:
      typeof row.customer === "string"
        ? JSON.parse(row.customer)
        : row.customer,
    items: typeof row.items === "string" ? JSON.parse(row.items) : row.items,
  } as Order;
}
