"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Plus,
  ArrowUpRight,
  Search,
  Check,
  ArrowLeft,
  ArrowRight,
  MessageSquare,
  AlertTriangle,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Building2,
  Wrench,
  Layers,
  Shield,
  Syringe,
  Compass,
  X,
  ChevronLeft,
} from "lucide-react";
import type { Product, Service } from "@/lib/types";
import { useStore, ProductImage } from "./store-provider";
import { Modal, SectionHeading } from "./ui";
import { contact } from "@/lib/seed";

// Approved CRETE-CHEM Service Taxonomy & Technical Mappings
export interface ApprovedService {
  id: string;
  title: string;
  shortDesc: string;
  technicalLabel: string;
  iconName: "building" | "wrench" | "layers" | "shield" | "syringe" | "compass";
  problemTitle: string;
  problemDescription: string;
  solutionTitle: string;
  solutionDescription: string;
  keyPoints: string[];
  recommendedProductIds: string[];
  dbServiceId: string;
}

const APPROVED_SERVICES: ApprovedService[] = [
  {
    id: "construction",
    title: "Construction Solutions",
    shortDesc:
      "Construction work delivered to specification and project requirements.",
    technicalLabel: "10-Yr Membrane",
    iconName: "building",
    problemTitle: "Substrate Honeycombing & Cold Joint Vulnerability",
    problemDescription:
      "Construction-phase defects including poorly consolidated concrete, unsealed cold joints, and unprimed substrates causing premature structural leaks and cracking.",
    solutionTitle: "Specification-Led Structural Waterproofing & Chemical Systems",
    solutionDescription:
      "Engineered site evaluation, monolithic elastomeric waterproofing barriers, and high-performance concrete admixtures certified to ASTM and BS standards.",
    keyPoints: [
      "Substrate evaluation & specification-led planning",
      "High-tensile seamless membrane barrier",
      "Certified applicator inspection & quality verification",
    ],
    recommendedProductIds: ["membranes", "admixtures", "coatings"],
    dbServiceId: "roof-waterproofing",
  },
  {
    id: "repair",
    title: "Repair & Rehabilitation",
    shortDesc:
      "Repair solutions using top-of-the-line construction chemical systems.",
    technicalLabel: "Potable Safe",
    iconName: "wrench",
    problemTitle: "Concrete Spalling & Corroded Steel Reinforcement",
    problemDescription:
      "Atmospheric carbonation, chloride attack, and moisture penetration corroding reinforcing steel bars and causing concrete cover spalling and loss of structural strength.",
    solutionTitle: "Polymer-Modified Structural Patch Mortar & Rebar Passivation",
    solutionDescription:
      "Complete mechanical breakout of unsound concrete, active zinc-rich cathodic rebar coating, and structural rebuilding with high-strength non-shrink repair mortars.",
    keyPoints: [
      "Rebar rust passivation & anti-corrosion barrier",
      "High-strength polymer-modified patch repair",
      "Long-term structural load recovery",
    ],
    recommendedProductIds: ["repair-solutions", "coatings", "grouts"],
    dbServiceId: "water-tank-leakage",
  },
  {
    id: "enhancement",
    title: "Structure Enhancement",
    shortDesc:
      "Structural enhancement and retrofitting for demanding applications.",
    technicalLabel: "Zero Tile Breakage",
    iconName: "layers",
    problemTitle: "Deficient Shear Capacity & Dynamic Structural Cracks",
    problemDescription:
      "Overloaded concrete slabs, seismic displacement, or architectural reconfigurations requiring structural strengthening without adding bulky dead weight.",
    solutionTitle: "Carbon Fiber (CFRP) Strengthening & Structural Epoxy",
    solutionDescription:
      "High-modulus carbon fiber fabrics and laminate plates bonded with structural epoxy adhesives to enhance flexural, tensile, and shear load capacity.",
    keyPoints: [
      "High-modulus carbon fiber composite bonding",
      "Zero downtime or demolition required",
      "Substantial increase in structural load capacity",
    ],
    recommendedProductIds: ["coatings", "repair-solutions", "sealants"],
    dbServiceId: "bathroom-leakage",
  },
  {
    id: "waterproofing",
    title: "Waterproofing Systems",
    shortDesc:
      "Static and dynamic waterproofing systems for roofs, tanks and structures.",
    technicalLabel: "High Hydrostatic",
    iconName: "shield",
    problemTitle: "Ponding Water Seepage & High Hydrostatic Pressure",
    problemDescription:
      "Persistent rainwater standing on concrete roof slabs, leaking water reservoir joints, and groundwater forcing through basement retaining walls.",
    solutionTitle: "Multi-Tier Elastomeric Polyurethane & Bituminous Membrane System",
    solutionDescription:
      "Monolithic liquid-applied polyurethane or torch-on APP membranes with 300%+ crack-bridging elasticity, backed by capillary crystalline waterproofing.",
    keyPoints: [
      "Continuous monolithic crack-bridging barrier",
      "High positive and negative hydrostatic resistance",
      "Food-grade safe potable tank certifications",
    ],
    recommendedProductIds: ["membranes", "coatings", "sealants"],
    dbServiceId: "basement-seepage",
  },
  {
    id: "grouting",
    title: "Grouting & Injection",
    shortDesc:
      "Pressure grouting and specialist injection solutions for difficult defects.",
    technicalLabel: "Anti-Efflorescence",
    iconName: "syringe",
    problemTitle: "Active Gushing Water, Internal Voids & Honeycombs",
    problemDescription:
      "High-pressure active water leaks through tie-rod holes, construction joints, and deep subterranean concrete honeycombs unreachable by surface coatings.",
    solutionTitle: "High-Pressure Hydrophobic Polyurethane & Microfine Grouting",
    solutionDescription:
      "Mechanical injection packers installed under 250+ bar pressure injecting fast-foaming hydrophobic PU resins that react instantly with water to seal cavities.",
    keyPoints: [
      "Instant water-stopping hydrophobic foam expansion",
      "Precision 250+ bar mechanical packer injection",
      "Permanent structural void consolidation",
    ],
    recommendedProductIds: ["grouts", "sealants", "repair-solutions"],
    dbServiceId: "wall-dampness",
  },
  {
    id: "custom",
    title: "Customized Solutions",
    shortDesc:
      "Practical solutions for special, complicated and project-specific jobs.",
    technicalLabel: "-8°C to -12°C Delta",
    iconName: "compass",
    problemTitle: "Extreme Thermal Shock, Acid Exposure & Site Constraints",
    problemDescription:
      "Extreme solar thermal radiation heating concrete slabs, aggressive industrial chemical spills, or complex structural expansion joints.",
    solutionTitle: "High-Albedo Thermal Barrier & Chemical-Resistant Screeds",
    solutionDescription:
      "Tailored multi-component chemical systems including high-albedo solar heat-reflective coatings (dropping roof temp 8°C–12°C) and heavy-duty resin linings.",
    keyPoints: [
      "Solar reflectance exceeding 85% (albedo barrier)",
      "Resistant to industrial acids, alkalis, and oils",
      "Bespoke ASTM/BS formulation & project warranty",
    ],
    recommendedProductIds: ["coatings", "admixtures", "sealants"],
    dbServiceId: "heat-proofing",
  },
];

function ServiceIconRenderer({
  name,
  size = 24,
}: {
  name: string;
  size?: number;
}) {
  switch (name) {
    case "building":
      return <Building2 size={size} />;
    case "wrench":
      return <Wrench size={size} />;
    case "layers":
      return <Layers size={size} />;
    case "shield":
      return <Shield size={size} />;
    case "syringe":
      return <Syringe size={size} />;
    case "compass":
      return <Compass size={size} />;
    default:
      return <Building2 size={size} />;
  }
}

// Single promotional label resolution helper
function getPromoBadge(
  product: Product
): { text: string; bg: string; textCol: string } | null {
  if (product.label && product.label.trim()) {
    const l = product.label.toLowerCase();
    if (l.includes("summer") || l.includes("sale")) {
      return { text: product.label, bg: "bg-[#ef4444]", textCol: "text-white" };
    }
    if (l.includes("winter")) {
      return { text: product.label, bg: "bg-[#0284c7]", textCol: "text-white" };
    }
    if (l.includes("azadi")) {
      return { text: product.label, bg: "bg-[#16a34a]", textCol: "text-white" };
    }
    if (l.includes("featured")) {
      return { text: product.label, bg: "bg-[#00a8ff]", textCol: "text-[#061a35]" };
    }
    return { text: product.label, bg: "bg-[#00d9ff]", textCol: "text-[#061a35]" };
  }
  if (product.featured) {
    return { text: "Featured", bg: "bg-[#00a8ff]", textCol: "text-[#061a35]" };
  }
  return null;
}

// =========================================================================
// PRODUCT CARD COMPONENT
// Strict Constraints:
// - Prioritize real product imagery
// - Category badge (top-left)
// - Promotion badge (top-right, only 1)
// - Product name & Short description
// - Add to Enquiry button
// - NO PHONE NUMBERS beneath individual products
// =========================================================================
export function ProductCard({ product }: { product: Product }) {
  const { add } = useStore();
  const [detail, setDetail] = useState(false);
  const [added, setAdded] = useState(false);

  const promo = getPromoBadge(product);

  const handleAdd = () => {
    add(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  const whatsappInquiry = encodeURIComponent(
    `Hello CRETE-CHEM, I am interested in ${product.name} (${product.category}). Please provide technical specifications, quotation and availability across Pakistan.`
  );

  return (
    <>
      <article
        className="bg-[#0a2344] rounded-xl border border-[#1b5a86]/80 hover:border-[#00d9ff] transition-all duration-300 overflow-hidden flex flex-col justify-between group shadow-[0_4px_20px_rgba(0,0,0,0.25)] hover:shadow-[0_12px_32px_rgba(0,168,255,0.16)] hover:-translate-y-0.5"
        id={`product-${product.id}`}
      >
        {/* Real Product Image Area with Category & Single Promo Badge */}
        <div className="relative aspect-[16/11] sm:h-52 bg-[#071d38] overflow-hidden">
          <button
            type="button"
            onClick={() => setDetail(true)}
            className="w-full h-full block relative cursor-pointer"
            aria-label={`View details for ${product.name}`}
          >
            <ProductImage product={product} />
          </button>

          {/* Category Badge - Top Left */}
          <span className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-[#061a35]/95 text-white border border-[#1b5a86]/80 backdrop-blur-sm pointer-events-none z-10 max-w-[55%] truncate">
            {product.category}
          </span>

          {/* Promotional Badge (if present) - Top Right */}
          {promo && (
            <span
              className={`absolute top-2.5 right-2.5 sm:top-3 sm:right-3 px-2.5 py-1 rounded text-[10px] font-bold tracking-wider ${promo.bg} ${promo.textCol} shadow-md uppercase pointer-events-none z-10`}
            >
              {promo.text}
            </span>
          )}
        </div>

        {/* Product Information Body */}
        <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between">
          <div>
            <button
              type="button"
              className="text-left w-full group/title cursor-pointer"
              onClick={() => setDetail(true)}
            >
              <h3 className="text-white font-bold text-base sm:text-lg mb-1.5 group-hover/title:text-[#00d9ff] transition-colors line-clamp-1">
                {product.name}
              </h3>
            </button>
            <p className="text-xs sm:text-sm text-[#9fb7cf] leading-relaxed line-clamp-2 mb-4">
              {product.description}
            </p>
          </div>

          {/* Card Actions: Add to Enquiry + Quick View Link (NO telephone numbers) */}
          <div className="pt-3.5 sm:pt-4 border-t border-[#1b5a86]/50 flex flex-col gap-2.5 mt-auto">
            <button
              type="button"
              className={`w-full min-h-[44px] py-2.5 px-4 rounded-lg font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                added
                  ? "bg-[#16a34a] text-white border border-[#16a34a]"
                  : "bg-[#0d2d52] hover:bg-[#00a8ff] text-white hover:text-[#061a35] border border-[#1b5a86] hover:border-[#00a8ff] active:scale-[0.99]"
              }`}
              onClick={handleAdd}
              aria-label={`Add ${product.name} to enquiry`}
            >
              {added ? (
                <>
                  <Check size={16} />
                  <span>Added to Enquiry</span>
                </>
              ) : (
                <>
                  <ShoppingBag size={16} />
                  <span>Add to Enquiry</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-between px-1 pt-0.5">
              <button
                type="button"
                onClick={() => setDetail(true)}
                className="text-[11px] font-semibold text-[#00d9ff] hover:text-white flex items-center gap-1 transition-colors cursor-pointer py-1"
              >
                <span>View specifications</span>
                <ArrowUpRight size={13} />
              </button>
              <Link
                href={`/products/${product.id}`}
                className="text-[11px] text-[#84a3c1] hover:text-[#00d9ff] transition-colors py-1"
              >
                Datasheet
              </Link>
            </div>
          </div>
        </div>
      </article>

      {/* Product Quick View Modal */}
      {detail && (
        <Modal
          title={product.name}
          onClose={() => setDetail(false)}
          maxWidth="880px"
          className="industrial-modal"
          hideDefaultHeading={true}
        >
          {/* Custom Sticky Header */}
          <div className="flex items-center justify-between p-4 sm:p-5 bg-[#061a32] border-b border-[#1b5a86]/40 sticky top-0 z-30">
            <button
              type="button"
              onClick={() => setDetail(false)}
              className="inline-flex items-center gap-2 text-xs font-bold text-[#bcd5e5] hover:text-[#00d9ff] transition-colors cursor-pointer min-h-[44px] py-1"
              aria-label="Back to products"
            >
              <ArrowLeft size={16} />
              <span>Back to Products</span>
            </button>
            <button
              type="button"
              onClick={() => setDetail(false)}
              className="min-w-[44px] min-h-[44px] w-11 h-11 rounded-full bg-[#0b2d4c] hover:bg-[#00d9ff] text-white hover:text-[#061a35] flex items-center justify-center transition-colors cursor-pointer border border-[#1b5a86]/50"
              aria-label="Close product details"
            >
              <X size={18} />
            </button>
          </div>

          {/* Two-Column Industrial Layout with independent scroll */}
          <div className="p-4 sm:p-7 grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 overflow-y-auto max-h-[calc(94dvh-75px)]">
            {/* Left Column (5 cols): Real Media & Fast Facts */}
            <div className="md:col-span-5 flex flex-col gap-4">
              <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-[#071d38] border border-[#1b5a86] shadow-inner">
                <ProductImage product={product} priority />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-[#061a35]/95 text-white border border-[#1b5a86]/80 backdrop-blur-sm z-10">
                  {product.category}
                </span>
                {promo && (
                  <span
                    className={`absolute top-3 right-3 px-2.5 py-1 rounded text-[10px] font-bold tracking-wider ${promo.bg} ${promo.textCol} uppercase shadow-md z-10`}
                  >
                    {promo.text}
                  </span>
                )}
              </div>

              {/* Fast Facts Card */}
              <div className="p-4 rounded-xl bg-[#0a2344] border border-[#1b5a86]/70 space-y-2 text-xs text-[#d6e8f4]">
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-[#00d9ff] shrink-0" />
                  <span>Technical application guidance &amp; dosage</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-[#00d9ff] shrink-0" />
                  <span>Inspection-led chemical specification</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-[#00d9ff] shrink-0" />
                  <span>Pakistan-wide supply &amp; authorized applicator</span>
                </div>
              </div>
            </div>

            {/* Right Column (7 cols): Copy, Benefits, Actions */}
            <div className="md:col-span-7 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-[#00d9ff] tracking-widest uppercase">
                  {product.category}
                </span>
                <h3 className="text-xl sm:text-3xl font-extrabold text-white mt-1 mb-3">
                  {product.name}
                </h3>
                <p className="text-xs sm:text-sm text-[#d6e8f4] leading-relaxed mb-4">
                  {product.description}
                </p>

                {/* Key Benefits */}
                {product.benefits && product.benefits.length > 0 && (
                  <div className="p-4 rounded-xl bg-[#0a2344] border border-[#1b5a86]/70 mb-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-2.5">
                      Key Benefits &amp; Performance Specifications
                    </h4>
                    <ul className="space-y-2 text-xs sm:text-sm text-[#eaf5ff]">
                      {product.benefits.map((b) => (
                        <li key={b} className="flex items-start gap-2">
                          <Check
                            size={16}
                            className="text-[#00d9ff] shrink-0 mt-0.5"
                          />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Recommended Applications */}
                {product.applications && product.applications.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#9fb7cf] mb-2">
                      Recommended Applications
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {product.applications.map((a) => (
                        <span
                          key={a}
                          className="px-2.5 py-1 text-xs rounded-md bg-[#0d2d52] border border-[#1b5a86] text-[#eaf5ff] font-medium"
                        >
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Compliance Note */}
                <div className="p-3.5 rounded-lg bg-[#071d38] border border-[#1b5a86]/80 text-xs text-[#9fb7cf] flex items-start gap-2.5 mb-5">
                  <ShieldCheck
                    size={18}
                    className="text-[#00d9ff] shrink-0 mt-0.5"
                  />
                  <span>
                    Manufactured to international ASTM and BS standards. Certified
                    Sika Pakistan application partner with full technical support.
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-3 border-t border-[#1b5a86]/40">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    className="w-full min-h-[46px] flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-[#00a8ff] hover:bg-[#00d9ff] text-[#061a35] font-bold text-sm transition-all shadow-md active:scale-[0.99] cursor-pointer"
                    onClick={() => {
                      add(product);
                      setDetail(false);
                    }}
                  >
                    <Plus size={18} />
                    <span>Add to Quotation Cart</span>
                  </button>

                  <a
                    href={`https://wa.me/${contact.whatsapp}?text=${whatsappInquiry}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full min-h-[46px] flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-[#16a34a] hover:bg-[#20c96a] text-white font-bold text-sm transition-colors cursor-pointer"
                  >
                    <MessageSquare size={18} />
                    <span>Ask on WhatsApp</span>
                  </a>
                </div>

                <Link
                  href={`/products/${product.id}`}
                  className="w-full min-h-[42px] flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-lg bg-[#0a2344] hover:bg-[#0d2d52] border border-[#1b5a86] text-[#eaf5ff] hover:text-white text-xs font-semibold transition-colors"
                >
                  <span>View Full Product Documentation &amp; Submittals</span>
                  <ArrowUpRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

// =========================================================================
// PRODUCTS SECTION (ProductsGrid)
// Desktop: 6 product cards in approved density (3 columns)
// Tablet: 2 or 3 columns
// Mobile: 1 column
// Real product imagery prioritized
// =========================================================================
export function ProductsGrid() {
  const { catalog } = useStore();
  const [category, setCategory] = useState("All systems");
  const [search, setSearch] = useState("");

  const categories = [
    "All systems",
    ...new Set(catalog.products.map((p) => p.category)),
  ];

  const products = catalog.products.filter(
    (p) =>
      (category === "All systems" || p.category === category) &&
      `${p.name} ${p.description} ${p.category}`
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <section
      id="products"
      className="section bg-[#061a35] relative"
      aria-label="High-performance construction chemicals catalog"
    >
      <span id="products-catalog" className="absolute -top-24" aria-hidden="true" />
      <div className="container">
        <SectionHeading
          eyebrow="OUR PRODUCTS"
          title="High-Performance Construction Chemicals"
          description="Engineered formulations manufactured to international ASTM and BS standards for maximum structural endurance and permanent leak prevention."
        />

        {/* Toolbar: Category Filters & Search */}
        <div className="catalog-toolbar">
          <div className="filter-row" aria-label="Product categories">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                className={category === c ? "chip selected" : "chip"}
                aria-pressed={category === c}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>
          <label className="search-field" htmlFor="catalog-search-input">
            <Search size={18} aria-hidden="true" />
            <input
              id="catalog-search-input"
              aria-label="Search products"
              placeholder="Find product by name or system…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
        </div>

        {/* Product Cards Grid: 3 cols on desktop (6 cards in approved density), 2 on tablet, 1 on mobile */}
        {products.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>No matching products found</h3>
            <p className="text-sm text-text-secondary mt-1">
              Try adjusting your category filter or search keywords.
            </p>
            <button
              type="button"
              className="text-link mt-4"
              onClick={() => {
                setSearch("");
                setCategory("All systems");
              }}
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Technical Material Submittals Banner from final.html */}
        <div className="mt-10 p-4 sm:p-5 rounded-xl bg-[#071d38] border border-[#1b5a86]/80 flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
          <p className="text-xs sm:text-sm text-[#9fb7cf] leading-relaxed max-w-2xl">
            Product categories are based on the Sika Pakistan product catalogue;
            final specification should be selected with the project requirements
            and current technical data sheet.
          </p>
          <span className="text-xs font-bold text-[#00d9ff] uppercase tracking-wider whitespace-nowrap">
            ASTM &amp; BS Standard Compliant • Authorized Sika Partner • Bulk Delivery Across Pakistan
          </span>
        </div>
      </div>
    </section>
  );
}

// =========================================================================
// SERVICES SECTION (ServicesGrid)
// 6 Services Taxonomy:
// 1. Construction Solutions
// 2. Repair & Rehabilitation
// 3. Structure Enhancement
// 4. Waterproofing Systems
// 5. Grouting & Injection
// 6. Customized Solutions
// Structure:
// - Icon (48x48 rounded navy container)
// - Service title (white, bold)
// - Short description (secondary text)
// - Bottom bar: "Get Free Inspection ->" + Small technical/value label
// - Clicking card opens Service Recommendation UI
// =========================================================================
export function ServicesGrid() {
  const { catalog, inspect, add } = useStore();
  const [selectedService, setSelectedService] = useState<ApprovedService | null>(
    null
  );
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(
    null
  );
  const [quickAddedId, setQuickAddedId] = useState<string | null>(null);

  // Map products recommended for this service from the live database/catalog
  const recommendedProducts = useMemo(() => {
    if (!selectedService) return [];
    return catalog.products.filter(
      (p) =>
        selectedService.recommendedProductIds.includes(p.id) ||
        p.serviceIds?.includes(selectedService.dbServiceId) ||
        p.serviceIds?.includes(selectedService.id)
    );
  }, [selectedService, catalog.products]);

  const handleQuickAdd = (p: Product) => {
    add(p);
    setQuickAddedId(p.id);
    setTimeout(() => setQuickAddedId(null), 1600);
  };

  const whatsappServiceInquiry = selectedService
    ? encodeURIComponent(
        `Hello CRETE-CHEM, I would like technical consultation for ${selectedService.title}. Please recommend the suitable Sika chemical system and quotation for our site.`
      )
    : "";

  return (
    <section
      id="services"
      className="section bg-[#071d38] border-y border-[#1b5a86]/50 relative"
      aria-label="CRETE-CHEM waterproofing and repair services"
    >
      <span id="services-catalog" className="absolute -top-24" aria-hidden="true" />
      <div className="container">
        <SectionHeading
          eyebrow="OUR SERVICES"
          title="Complete Waterproofing & Repair Solutions"
          description="Engineered chemical barriers and precision multi-layer coatings to eliminate structural water intrusion and guarantee long-term structural integrity."
        />

        {/* 6 Approved Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {APPROVED_SERVICES.map((s) => (
            <div
              key={s.id}
              role="button"
              tabIndex={0}
              onClick={() => setSelectedService(s)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelectedService(s);
                }
              }}
              className="bg-[#0a2344] rounded-xl p-5 sm:p-6 lg:p-7 border border-[#1b5a86]/80 hover:border-[#00d9ff] hover:bg-[#0d2d52] transition-all duration-300 flex flex-col justify-between group cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.25)] hover:shadow-[0_12px_32px_rgba(0,168,255,0.14)] hover:-translate-y-1 active:scale-[0.99]"
              aria-label={`View solutions for ${s.title}`}
            >
              <div>
                {/* 48x48 Icon Box */}
                <div className="w-12 h-12 rounded-xl bg-[#071d38] border border-[#1b5a86] flex items-center justify-center text-[#00d9ff] group-hover:bg-[#00a8ff] group-hover:text-[#061a35] transition-all duration-300 mb-4">
                  <ServiceIconRenderer name={s.iconName} size={24} />
                </div>

                {/* Title */}
                <h3 className="text-white font-bold text-lg sm:text-xl mb-2 group-hover:text-[#00d9ff] transition-colors">
                  {s.title}
                </h3>

                {/* Short Description */}
                <p className="text-xs sm:text-sm text-[#9fb7cf] leading-relaxed mb-5 sm:mb-6 line-clamp-2">
                  {s.shortDesc}
                </p>
              </div>

              {/* Bottom Bar: Action link + Small technical/value label */}
              <div className="pt-3.5 sm:pt-4 border-t border-[#1b5a86]/50 flex items-center justify-between gap-2 w-full mt-auto">
                <span className="text-xs sm:text-sm font-semibold text-[#00a8ff] group-hover:text-[#00d9ff] flex items-center gap-1.5 transition-colors py-1">
                  <span>Get Free Inspection</span>
                  <ArrowRight
                    size={14}
                    className="group-hover:translate-x-1 transition-transform shrink-0"
                  />
                </span>
                <span className="text-[10.5px] sm:text-[11px] font-semibold tracking-wide text-[#84a3c1] bg-[#071d38] px-2.5 py-1 rounded border border-[#1b5a86]/60 group-hover:border-[#00d9ff]/50 transition-colors shrink-0">
                  {s.technicalLabel}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Section Bottom Banner from final.html */}
        <div className="mt-8 sm:mt-10 p-4 sm:p-5 rounded-xl bg-[#0a2344] border border-[#1b5a86]/80 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-3">
            <ShieldCheck size={24} className="text-[#00d9ff] shrink-0" />
            <span className="text-xs sm:text-sm font-semibold text-white">
              Specialist work includes construction, repair, retrofitting, waterproofing, grouting, epoxy injection and pressure grouting.
            </span>
          </div>
          <div className="flex items-center justify-center md:justify-end gap-3 sm:gap-4 shrink-0 w-full sm:w-auto">
            <span className="hidden lg:inline text-xs text-[#84a3c1]">
              ISO 9001:2015 • Sika Certified Applicators • Pakistan-Wide
            </span>
            <button
              type="button"
              onClick={() => inspect("roof-waterproofing")}
              className="w-full sm:w-auto min-h-[44px] text-xs sm:text-sm font-bold text-[#00a8ff] hover:text-[#00d9ff] inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer bg-[#071d38] px-4 py-2.5 rounded-lg border border-[#1b5a86] hover:border-[#00d9ff]"
            >
              <span>Book Inspection</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* SERVICE RECOMMENDATION UI (Industrial Modal)                         */}
      {/* =================================================================== */}
      {selectedService && (
        <Modal
          title={selectedService.title}
          onClose={() => setSelectedService(null)}
          maxWidth="780px"
          className="industrial-modal"
          hideDefaultHeading={true}
        >
          {/* Custom Sticky Header */}
          <div className="p-4 sm:p-5 bg-[#061a32] border-b border-[#1b5a86]/40 flex items-center justify-between gap-3 sticky top-0 z-30">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#00d9ff] block mb-0.5">
                RECOMMENDED SYSTEM &amp; SERVICE
              </span>
              <h3 className="text-lg sm:text-2xl font-extrabold text-white">
                {selectedService.title}
              </h3>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="px-2.5 py-1 rounded-full bg-[#00d9ff] text-[#001525] font-black text-[11px] sm:text-xs uppercase tracking-wider whitespace-nowrap">
                BEST MATCH
              </span>
              <button
                type="button"
                onClick={() => setSelectedService(null)}
                className="min-w-[44px] min-h-[44px] w-11 h-11 rounded-full bg-[#0b2d4c] hover:bg-[#00d9ff] text-white hover:text-[#061a35] flex items-center justify-center transition-colors cursor-pointer border border-[#1b5a86]/50 text-lg font-bold"
                aria-label="Close recommendation"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="p-4 sm:p-6 space-y-4 overflow-y-auto max-h-[calc(94dvh-135px)]">
            {/* Step 1: Problem / Defect */}
            <div className="rounded-xl bg-[#071d38] border border-[#f59e0b]/40 p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#f59e0b]/20 text-[#fbbf24] border border-[#f59e0b]/40 flex items-center gap-1.5">
                  <AlertTriangle size={12} /> Identified Defect
                </span>
              </div>
              <h4 className="text-white font-bold text-sm sm:text-base mb-1.5">
                {selectedService.problemTitle}
              </h4>
              <p className="text-xs sm:text-sm text-[#eaf5ff] leading-relaxed">
                {selectedService.problemDescription}
              </p>
            </div>

            {/* Step 2: CRETE-CHEM Solution */}
            <div className="rounded-xl bg-[#071d38] border border-[#00a8ff]/40 p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#00a8ff]/20 text-[#00d9ff] border border-[#00a8ff]/40 flex items-center gap-1.5">
                  <ShieldCheck size={12} /> CRETE-CHEM Solution
                </span>
                <span className="text-[11px] font-semibold text-[#84a3c1] ml-auto">
                  {selectedService.technicalLabel}
                </span>
              </div>
              <h4 className="text-white font-bold text-sm sm:text-base mb-1.5">
                {selectedService.solutionTitle}
              </h4>
              <p className="text-xs sm:text-sm text-[#d6e8f4] leading-relaxed mb-3">
                {selectedService.solutionDescription}
              </p>
              <div className="space-y-2 text-xs sm:text-sm text-[#eaf5ff]">
                {selectedService.keyPoints.map((pt, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <Check size={15} className="text-[#00d9ff] shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 3: Recommended Product(s) */}
            <div className="rounded-xl bg-[#071d38] border border-[#1b5a86] p-4 sm:p-5">
              <div className="flex items-center justify-between mb-3 flex-wrap gap-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#00d9ff]">
                  RECOMMENDED PRODUCTS &amp; CHEMICAL SYSTEMS
                </span>
                <span className="text-xs text-[#84a3c1]">
                  {recommendedProducts.length} Systems Mapped
                </span>
              </div>

              <div className="space-y-3">
                {recommendedProducts.map((p) => {
                  const isAdded = quickAddedId === p.id;
                  return (
                    <div
                      key={p.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-[#0a2344] border border-[#1b5a86]/80 rounded-xl p-3 sm:p-3.5 hover:border-[#00d9ff]/60 transition-colors"
                    >
                      <div className="relative w-full sm:w-24 h-28 sm:h-20 rounded-lg overflow-hidden shrink-0 bg-[#071d38] border border-[#1b5a86]/60">
                        <ProductImage product={p} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#00d9ff] block truncate">
                          {p.category}
                        </span>
                        <h5 className="text-white font-bold text-sm truncate">
                          {p.name}
                        </h5>
                        <p className="text-xs text-[#9fb7cf] line-clamp-2 mt-0.5">
                          {p.description}
                        </p>
                        <div className="flex items-center gap-3 mt-1.5 text-[10px] text-[#84a3c1]">
                          <span>✓ Inspection-led selection</span>
                          <span>✓ Application guidance</span>
                        </div>
                      </div>
                      <div className="flex sm:flex-col gap-2 shrink-0 w-full sm:w-auto pt-1 sm:pt-0">
                        <button
                          type="button"
                          onClick={() => setQuickViewProduct(p)}
                          className="flex-1 sm:flex-none min-h-[40px] px-3.5 py-2 rounded-lg bg-[#071d38] hover:bg-[#00d9ff] hover:text-[#061a35] border border-[#1b5a86] text-xs font-semibold text-white transition-colors cursor-pointer flex items-center justify-center"
                        >
                          Details
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickAdd(p)}
                          className={`flex-1 sm:flex-none min-h-[40px] px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                            isAdded
                              ? "bg-[#16a34a] text-white"
                              : "bg-[#00a8ff] text-[#061a35] hover:bg-[#00d9ff]"
                          }`}
                        >
                          {isAdded ? <Check size={13} /> : <Plus size={13} />}
                          <span>{isAdded ? "Added ✓" : "Add to Enquiry"}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}

                {recommendedProducts.length === 0 && (
                  <p className="text-xs text-[#9fb7cf] py-2">
                    Our technical inspector will assess your substrate on site and
                    prescribe the exact compatible Sika chemical system.
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons: Primary & Secondary */}
            <div className="space-y-2.5 pt-3 border-t border-[#1b5a86]/40 sticky bottom-0 bg-[#071f39]/95 backdrop-blur-sm pb-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  className="w-full min-h-[46px] flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-[#00a8ff] hover:bg-[#00d9ff] text-[#061a35] font-bold text-sm transition-all shadow-md active:scale-[0.99] cursor-pointer"
                  onClick={() => {
                    const dbId = selectedService.dbServiceId;
                    setSelectedService(null);
                    inspect(dbId);
                  }}
                >
                  <Sparkles size={16} />
                  <span>Request Free Inspection →</span>
                </button>

                <a
                  href={`https://wa.me/${contact.whatsapp}?text=${whatsappServiceInquiry}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full min-h-[46px] flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-[#16a34a] hover:bg-[#20c96a] text-white font-bold text-sm transition-colors cursor-pointer"
                >
                  <MessageSquare size={16} />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>

              <button
                type="button"
                onClick={() => setSelectedService(null)}
                className="w-full min-h-[36px] py-2 text-center text-xs text-[#84a3c1] hover:text-white transition-colors cursor-pointer flex items-center justify-center"
              >
                Close Recommendation
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Nested Product Quick View from recommendation drawer */}
      {quickViewProduct && (
        <Modal
          title={quickViewProduct.name}
          onClose={() => setQuickViewProduct(null)}
          maxWidth="720px"
          className="industrial-modal"
          hideDefaultHeading={true}
        >
          <div className="flex items-center justify-between p-4 bg-[#061a32] border-b border-[#1b5a86]/40 sticky top-0 z-30">
            <button
              type="button"
              onClick={() => setQuickViewProduct(null)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00d9ff] hover:underline cursor-pointer min-h-[44px] py-1"
            >
              <ChevronLeft size={16} />
              <span>Back to Recommendation</span>
            </button>
            <button
              type="button"
              onClick={() => setQuickViewProduct(null)}
              className="min-w-[44px] min-h-[44px] w-11 h-11 rounded-full bg-[#0b2d4c] hover:bg-[#00d9ff] text-white hover:text-[#061a35] flex items-center justify-center transition-colors cursor-pointer border border-[#1b5a86]/50"
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </div>

          <div className="p-4 sm:p-6 space-y-4 overflow-y-auto max-h-[calc(94dvh-75px)]">
            <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden bg-[#071d38] border border-[#1b5a86]">
              <ProductImage product={quickViewProduct} priority />
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-[#061a35]/95 text-white border border-[#1b5a86]">
                {quickViewProduct.category}
              </span>
            </div>

            <div>
              <span className="text-xs font-bold text-[#00d9ff] tracking-wider uppercase">
                {quickViewProduct.category}
              </span>
              <h3 className="text-xl font-bold text-white mt-1">
                {quickViewProduct.name}
              </h3>
              <p className="text-xs sm:text-sm text-[#d6e8f4] leading-relaxed mt-2">
                {quickViewProduct.description}
              </p>
            </div>

            {quickViewProduct.benefits && quickViewProduct.benefits.length > 0 && (
              <div className="p-3.5 rounded-lg bg-[#071d38] border border-[#1b5a86]/70">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-2">
                  Key Specifications
                </h4>
                <ul className="space-y-1.5 text-xs text-[#eaf5ff]">
                  {quickViewProduct.benefits.map((b) => (
                    <li key={b} className="flex items-start gap-2">
                      <Check size={14} className="text-[#00d9ff] shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <button
                type="button"
                className="w-full sm:flex-1 min-h-[46px] py-3 rounded-lg bg-[#00a8ff] hover:bg-[#00d9ff] text-[#061a35] font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                onClick={() => {
                  add(quickViewProduct);
                  setQuickViewProduct(null);
                }}
              >
                <Plus size={15} />
                <span>Add to Quotation Cart</span>
              </button>
              <Link
                href={`/products/${quickViewProduct.id}`}
                className="w-full sm:flex-1 min-h-[46px] py-3 rounded-lg bg-[#0a2344] hover:bg-[#0d2d52] border border-[#1b5a86] text-white font-bold text-xs text-center transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Full Datasheet</span>
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        </Modal>
      )}
    </section>
  );
}

// =========================================================================
// PRODUCT DETAIL PAGE COMPONENT (for /products/[id])
// =========================================================================
export function ProductDetail({ product }: { product: Product }) {
  const { add, inspect, catalog } = useStore();
  const [added, setAdded] = useState(false);
  const promo = getPromoBadge(product);

  const handleAdd = () => {
    add(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  const whatsappProductInquiry = encodeURIComponent(
    `Hello CRETE-CHEM, I am viewing the technical datasheet for ${product.name} (${product.category}). Please provide quotation, pack size and availability.`
  );

  return (
    <main id="main">
      <div className="container section">
        <Link
          className="text-link inline-flex items-center gap-1.5 mb-6 text-[#00d9ff] hover:underline"
          href="/#products"
        >
          <ArrowLeft size={17} /> Back to all products
        </Link>
        <div className="product-detail">
          <div className="detail-image">
            <ProductImage product={product} priority />
          </div>
          <div>
            <p className="eyebrow">{product.category}</p>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              {product.name}
            </h1>
            {promo && (
              <span
                className={`inline-block px-2.5 py-1 rounded text-xs font-bold ${promo.bg} ${promo.textCol} mb-3`}
              >
                {promo.text}
              </span>
            )}
            <p className="lead text-[#a8c3d8] mt-3 mb-5 leading-relaxed">
              {product.description}
            </p>

            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-2">
              Key benefits & Specifications
            </h3>
            <ul className="benefit-list mb-6">
              {product.benefits.map((b) => (
                <li key={b} className="flex items-start gap-2 text-sm text-[#d6e8f4]">
                  <Check size={17} className="text-[#00d9ff] shrink-0 mt-0.5" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-2">
              Recommended Applications
            </h3>
            <div className="filter-row mb-6">
              {product.applications.map((a) => (
                <span className="chip" key={a}>
                  {a}
                </span>
              ))}
            </div>

            <div className="p-4 rounded-lg bg-[#071d38] border border-[#1b5a86] text-xs text-[#a8c3d8] mb-6 flex items-start gap-2.5">
              <ShieldCheck size={20} className="text-[#00d9ff] shrink-0 mt-0.5" />
              <span>
                Product family specification. Please consult our technical team
                for exact product pack size, dilution ratios, and ASTM/BS
                compliance data for your project.
              </span>
            </div>

            <div className="button-row flex flex-wrap gap-3">
              <button
                type="button"
                className="button primary"
                onClick={handleAdd}
              >
                {added ? <Check size={18} /> : <Plus size={18} />}
                <span>{added ? "Added to Cart" : "Add to quotation cart"}</span>
              </button>
              <a
                href={`https://wa.me/${contact.whatsapp}?text=${whatsappProductInquiry}`}
                target="_blank"
                rel="noopener noreferrer"
                className="button whatsapp bg-[#16a34a] hover:bg-[#20c96a] text-white font-bold flex items-center gap-2 px-5 py-3 rounded-lg"
              >
                <MessageSquare size={18} /> Enquire on WhatsApp
              </a>
              <button
                type="button"
                className="button secondary"
                onClick={() => inspect(product.serviceIds[0] || "")}
              >
                Request site inspection
              </button>
            </div>
          </div>
        </div>

        {/* Compatible Services */}
        <SectionHeading
          eyebrow="SYSTEM COMPATIBILITY"
          title="Compatible Service Applications"
          description="Explore the structural systems where this product formulation is routinely specified."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {catalog.services
            .filter((s) => s.recommendedProductIds.includes(product.id))
            .map((s) => (
              <button
                type="button"
                className="service-card text-left"
                key={s.id}
                onClick={() => inspect(s.id)}
              >
                <h3>{s.title}</h3>
                <p>{s.description}</p>
                <span className="text-link">
                  Request inspection <ArrowUpRight size={18} />
                </span>
              </button>
            ))}
        </div>
      </div>
    </main>
  );
}
