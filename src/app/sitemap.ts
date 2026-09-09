import type { MetadataRoute } from "next";
import { publicCatalog } from "@/lib/repository";
export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL || "https://crete-chem.vercel.app";
  const { products } = await publicCatalog();
  return [
    { url: base, changeFrequency: "weekly", priority: 1 },
    ...products.map((p) => ({
      url: `${base}/products/${p.id}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
