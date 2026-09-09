import type { Catalog } from "./types";
export function recommend(
  catalog: Catalog,
  problem: string,
  description: string,
) {
  const text = `${problem} ${description}`.toLowerCase();
  const ranked = catalog.services
    .filter((s) => s.active)
    .map((s) => ({
      service: s,
      score: [s.title, ...s.tags]
        .flatMap((t) => t.toLowerCase().split(/\W+/))
        .filter((t) => t.length > 3 && text.includes(t)).length,
    }))
    .sort((a, b) => b.score - a.score);
  const services = ranked
    .filter((s) => s.score > 0)
    .slice(0, 2)
    .map((s) => s.service);
  const ids = new Set(services.flatMap((s) => s.recommendedProductIds));
  if (/crack|concrete|repair|structural/.test(text)) {
    ids.add("repair-solutions");
    ids.add("sealants");
  }
  return {
    services,
    products: catalog.products
      .filter((p) => p.active && ids.has(p.id))
      .slice(0, 3),
  };
}
