import { notFound } from "next/navigation";
import { publicCatalog } from "@/lib/repository";
import { ProductDetail } from "@/components/products";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const p = (await publicCatalog()).products.find((p) => p.id === id);
  return { title: p?.name || "Product not found", description: p?.description };
}
export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = (await publicCatalog()).products.find((p) => p.id === id);
  if (!product) notFound();
  return <ProductDetail product={product} />;
}
