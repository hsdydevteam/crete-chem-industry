"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { MessageSquare, Check, Sparkles } from "lucide-react";
import { contact } from "@/lib/seed";

export interface ComparisonCase {
  id: string;
  tabLabel: string;
  badge: string;
  title: string;
  headline: string;
  description: string;
  points: string[];
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  beforePosition?: string;
  afterPosition?: string;
}

export const COMPARISON_CASES: ComparisonCase[] = [
  {
    id: "roof",
    tabLabel: "Roof Waterproofing",
    badge: "Roof Waterproofing",
    title: "Roof / Rooftop Waterproofing",
    headline: "Seal the leak. Protect the structure.",
    description:
      "Substrate crack injection, ponding elimination, and multi-layer elastomeric waterproofing membrane application to permanently safeguard concrete slabs against harsh weather and thermal expansion.",
    points: [
      "Deep substrate preparation & cleaning",
      "Crack routing & elastomeric sealing",
      "UV-resistant continuous membrane barrier",
    ],
    beforeImage: "/assets/roof-before.webp",
    afterImage: "/assets/roof-after.webp",
    beforeLabel: "WATER-DAMAGED SLAB",
    afterLabel: "PROTECTED WATERPROOF ROOF",
    beforePosition: "center 40%",
    afterPosition: "center 40%",
  },
  {
    id: "concrete",
    tabLabel: "Concrete Protection",
    badge: "Concrete Repair & Protection",
    title: "Concrete Protection & Repair",
    headline: "Repair structural honeycombing & spalling.",
    description:
      "Engineered polymer-modified repair mortars and anti-carbonation hydrophobic protective coatings restore structural load capacity and prevent internal reinforcement rebar corrosion.",
    points: [
      "Mechanical chipping & rebar priming",
      "Non-shrink structural repair mortar",
      "Hydrophobic breathable penetrating sealer",
    ],
    beforeImage: "/assets/concrete-before.webp",
    afterImage: "/assets/concrete-after.webp",
    beforeLabel: "SPALLED & DETERIORATED CONCRETE",
    afterLabel: "ENGINEERED RESTORED CONCRETE",
    beforePosition: "center center",
    afterPosition: "center center",
  },
  {
    id: "basement",
    tabLabel: "Basement Seepage",
    badge: "Basement Waterproofing",
    title: "Basement Seepage Control",
    headline: "Eliminate high hydrostatic water seepage.",
    description:
      "Negative-side crystalline slurry and high-pressure polyurethane chemical injection permanently arrest underground hydrostatic water seepage through retaining walls and floor joints.",
    points: [
      "High-pressure polyurethane injection",
      "Negative-side crystalline barrier coating",
      "Dry, usable below-grade storage & living space",
    ],
    beforeImage: "/assets/basement-before.webp",
    afterImage: "/assets/basement-after.webp",
    beforeLabel: "ACTIVE BASEMENT SEEPAGE",
    afterLabel: "SEALED DRY BASEMENT ENCLOSURE",
    beforePosition: "center center",
    afterPosition: "center center",
  },
  {
    id: "floor",
    tabLabel: "Industrial Floor",
    badge: "Industrial Flooring & Epoxy",
    title: "Industrial Floor Protection",
    headline: "High-load abrasion resistance & clean finish.",
    description:
      "Heavy-duty self-leveling epoxy and polyurethane screed systems built to withstand forklift traffic, chemical spills, thermal cycling, and high-impact industrial operations.",
    points: [
      "Dust-free diamond grinding preparation",
      "High-build chemical-resistant epoxy primer",
      "Seamless hygienic high-durability finish",
    ],
    beforeImage: "/assets/floor-before.webp",
    afterImage: "/assets/floor-after.webp",
    beforeLabel: "WORN UNSEALED CONCRETE FLOOR",
    afterLabel: "PROTECTED INDUSTRIAL EPOXY FINISH",
    beforePosition: "center 65%",
    afterPosition: "center 65%",
  },
  {
    id: "bathroom",
    tabLabel: "Bathroom / Washroom",
    badge: "Washroom Seepage",
    title: "Bathroom & Washroom Seepage",
    headline: "Permanent moisture barrier below tiles.",
    description:
      "Flexible two-component cementitious waterproofing installed around plumbing traps, sanitary fittings, and shower floors prevents moisture penetration into adjacent walls and lower floors.",
    points: [
      "Pipe collar and floor drain joint sealing",
      "Flexible elastomeric polymer slurry layer",
      "Zero hidden leakage into ceiling slabs",
    ],
    beforeImage: "/assets/bathroom-before.webp",
    afterImage: "/assets/bathroom-after.webp",
    beforeLabel: "LEAKING SUBFLOOR JOINT",
    afterLabel: "WATERPROOFED TILE SUBSTRATE",
    beforePosition: "center center",
    afterPosition: "center center",
  },
  {
    id: "wall",
    tabLabel: "Wall Dampness",
    badge: "Wall Dampness & Efflorescence",
    title: "Wall Dampness & Efflorescence",
    headline: "Stop rising damp & salt crystallization.",
    description:
      "Damp-proof chemical injection barriers and breathable anti-efflorescence protective coatings halt capillary suction and prevent paint peeling, salt bubbling, and plaster decay.",
    points: [
      "Damp-proof course (DPC) chemical barrier",
      "Anti-salt efflorescence treatment",
      "Smooth breathable plaster protection",
    ],
    beforeImage: "/assets/wall-before.webp",
    afterImage: "/assets/wall-after.webp",
    beforeLabel: "DAMP PEELING WALL EFFLORESCENCE",
    afterLabel: "RESTORED DAMP-FREE PROTECTED WALL",
    beforePosition: "center 30%",
    afterPosition: "center 30%",
  },
  {
    id: "tank",
    tabLabel: "Water Tank",
    badge: "Water Tank Waterproofing",
    title: "Water Tank & Reservoir Waterproofing",
    headline: "Non-toxic certified potable water sealing.",
    description:
      "Food-grade certified, non-toxic elastomeric waterproofing systems for underground and overhead reinforced concrete water tanks, resisting positive water pressure and preventing contamination.",
    points: [
      "Non-toxic potable water certified materials",
      "Joint and crack structural sealing",
      "High hydraulic pressure resistance",
    ],
    beforeImage: "/assets/tank-before.webp",
    afterImage: "/assets/tank-after.webp",
    beforeLabel: "CONTAMINATED LEAKING RESERVOIR",
    afterLabel: "SEALED FOOD-GRADE WATER TANK",
    beforePosition: "center center",
    afterPosition: "center center",
  },
];

export function BeforeAfterSection() {
  const [activeCaseIndex, setActiveCaseIndex] = useState(0);
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentCase = COMPARISON_CASES[activeCaseIndex] || COMPARISON_CASES[0];

  // Measure container width for responsive optical alignment
  const updateDimensions = useCallback(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
    }
  }, []);

  useEffect(() => {
    updateDimensions();
    const observer = new ResizeObserver(() => updateDimensions());
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, [updateDimensions]);

  // Handle pointer / touch dragging
  const handlePositionChange = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(Math.round(pct * 10) / 10);
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    handlePositionChange(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    handlePositionChange(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // Safe fallback if pointer capture already ended
      }
    }
  };

  // Keyboard navigation for accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      setSliderPos((prev) => Math.max(0, prev - 5));
    } else if (e.key === "ArrowRight") {
      setSliderPos((prev) => Math.min(100, prev + 5));
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hello CRETE-CHEM, I am interested in your ${currentCase.title} service. Please provide technical advice and quotation.`
  );

  return (
    <section
      id="service-impact"
      className="service-impact-section"
      aria-label="Before and after case studies"
    >
      <div className="crete-container">
        <div className="impact-heading">
          <span className="impact-eyebrow">SEE THE DIFFERENCE</span>
          <h2>From Problem to Protection.</h2>
          <p>
            Explore the visual difference a correctly selected CRETE-CHEM
            service is designed to achieve. Drag the handle to compare before
            and after.
          </p>
        </div>

        <div className="impact-layout">
          {/* Left Column: Case Selector & Description */}
          <div className="impact-copy">
            {/* Top Selector Tabs */}
            <div
              className="impact-tabs"
              role="tablist"
              aria-label="Waterproofing comparison cases"
            >
              {COMPARISON_CASES.map((item, idx) => {
                const isActive = idx === activeCaseIndex;
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    className={`impact-tab ${isActive ? "active" : ""}`}
                    onClick={() => {
                      setActiveCaseIndex(idx);
                      setSliderPos(50);
                    }}
                  >
                    {item.tabLabel}
                  </button>
                );
              })}
            </div>

            {/* Case Details Card */}
            <div className="impact-meta">
              <span>{currentCase.badge}</span>
              <strong>{currentCase.headline}</strong>
              <p>{currentCase.description}</p>
            </div>

            {/* Checklist Points */}
            <div className="impact-points">
              {currentCase.points.map((pt, i) => (
                <span key={i}>
                  <Check
                    size={14}
                    className="inline-block mr-1 text-cyan shrink-0"
                  />
                  {pt}
                </span>
              ))}
            </div>

            {/* Call to Action */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href={`https://wa.me/${contact.whatsapp}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="impact-cta impact-whatsapp-cta"
                aria-label={`Enquire on WhatsApp about ${currentCase.title}`}
              >
                <MessageSquare size={18} />
                <span>WhatsApp CRETE-CHEM</span>
              </a>
              <a
                href="#request-inspection"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-[#1b5a86] bg-[#0a2344] text-[#e5f0f7] text-sm font-semibold hover:border-cyan hover:bg-[#0d2d52] transition-colors"
              >
                <Sparkles size={16} className="text-cyan" />
                <span>Book Free Site Inspection</span>
              </a>
            </div>
          </div>

          {/* Right Column: Interactive Drag Slider */}
          <div className="space-y-4">
            <div
              ref={containerRef}
              className="before-after"
              id="beforeAfter"
              role="region"
              aria-label="Interactive before and after comparison slider"
              tabIndex={0}
              onKeyDown={handleKeyDown}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
            >
              {/* Layer 1: AFTER Image (Protected surface) */}
              <div className="ba-image ba-after">
                <Image
                  src={currentCase.afterImage}
                  alt={`${currentCase.title} - After treatment`}
                  fill
                  sizes="(max-width: 900px) 100vw, 720px"
                  className="object-cover"
                  style={{
                    objectPosition: currentCase.afterPosition || "center center",
                  }}
                  priority={activeCaseIndex === 0}
                />
                <div className="ba-tag ba-tag-after">
                  {currentCase.afterLabel || "PROTECTED SURFACE"}
                </div>
              </div>

              {/* Layer 2: BEFORE Image (Water-damaged surface, clipped) */}
              <div
                className="ba-image ba-before"
                style={{ width: `${sliderPos}%` }}
              >
                <div
                  className="ba-before-inner"
                  style={{
                    width: containerWidth ? `${containerWidth}px` : "100%",
                  }}
                >
                  <Image
                    src={currentCase.beforeImage}
                    alt={`${currentCase.title} - Before treatment`}
                    fill
                    sizes="(max-width: 900px) 100vw, 720px"
                    className="object-cover"
                    style={{
                      objectPosition: currentCase.beforePosition || "center center",
                    }}
                    priority={activeCaseIndex === 0}
                  />
                  <div className="ba-tag ba-tag-before">
                    {currentCase.beforeLabel || "WATER-DAMAGED SURFACE"}
                  </div>
                </div>
              </div>

              {/* Center Divider Line with Handle */}
              <div
                className="ba-divider"
                style={{ left: `${sliderPos}%` }}
                aria-hidden="true"
              >
                <span>↔</span>
              </div>

              {/* Corner Badges */}
              <div className="ba-label ba-left">BEFORE</div>
              <div className="ba-label ba-right">AFTER</div>

              {/* Hidden Accessible Range Input */}
              <input
                type="range"
                min="0"
                max="100"
                value={sliderPos}
                onChange={(e) => setSliderPos(Number(e.target.value))}
                className="ba-range"
                aria-label="Adjust before and after comparison view"
              />
            </div>

            {/* Thumbnail Case Switcher Gallery */}
            <div
              className="ba-gallery"
              role="tablist"
              aria-label="Comparison thumbnail cases"
            >
              {COMPARISON_CASES.map((c, idx) => {
                const isActive = idx === activeCaseIndex;
                return (
                  <button
                    key={c.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    className={`ba-case ${isActive ? "active" : ""}`}
                    onClick={() => {
                      setActiveCaseIndex(idx);
                      setSliderPos(50);
                    }}
                  >
                    <div className="relative w-full h-[58px] overflow-hidden rounded-t-[8px]">
                      <Image
                        src={c.afterImage}
                        alt={c.title}
                        fill
                        sizes="160px"
                        className="object-cover"
                        style={{
                          objectPosition: c.afterPosition || "center center",
                        }}
                      />
                    </div>
                    <span>{c.tabLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
