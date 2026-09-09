import { redirect } from "next/navigation";
export default async function LegacyProduct({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  redirect(id ? `/products/${encodeURIComponent(id)}` : "/products");
}
