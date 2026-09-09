"use client";

import { useState, useEffect, useRef, type FormEvent } from "react";
import {
  X,
  Send,
  MessageCircle,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Wrench,
  Sparkles,
} from "lucide-react";
import { contact } from "@/lib/seed";
import { useStore } from "./store-provider";

interface AssistantCase {
  key: string;
  label: string;
  title: string;
  interpretation: string;
  solution: string;
  product: string;
}

const PREDEFINED_QUESTIONS: AssistantCase[] = [
  {
    key: "roof",
    label: "Roof / Terrace",
    title: "Roof & Terrace Waterproofing",
    interpretation:
      "Thermal expansion cycles, failed parapet wall flashing, ponding water, or hairline concrete micro-cracks allowing rainwater penetration through the structural slab.",
    solution:
      "Mechanical substrate preparation, crack routing & elastomeric sealing, polymer-modified corner coving at 90° joints, followed by a seamless multi-coat UV-resistant elastomeric membrane with geo-textile reinforcement.",
    product: "Sikalastic 510 / Liquid-Applied Polyurethane Membrane System",
  },
  {
    key: "wall",
    label: "Wall Dampness",
    title: "Wall Dampness & Efflorescence Control",
    interpretation:
      "Capillary rising damp from ground moisture, external wind-driven rain penetration through porous brickwork, or concealed plumbing pipe micro-leakage causing paint blistering and white salt deposits.",
    solution:
      "Moisture profiling to map the leak origin, stripping damaged plaster, applying a dual-coat polymer-modified cementitious crystalline barrier, and replastering with hydrophobic mortar admixture.",
    product: "SikaTop 107 Seal / Sika-1 Damp-Proofing Barrier System",
  },
  {
    key: "basement",
    label: "Basement Seepage",
    title: "Basement Seepage & Hydrostatic Pressure",
    interpretation:
      "Active water seepage through cold construction joints, retaining wall honeycombing, or floor-wall junctions under heavy surrounding water table pressure.",
    solution:
      "High-pressure chemical injection using hydrophilic/hydrophobic polyurethane foam to instantly arrest flowing water, followed by negative-side crystalline slurry and polymer mortar fillets.",
    product: "Sika Injection-201 CE / Sikadur Epoxy Grouting & SikaTop 107 Plus",
  },
  {
    key: "floor",
    label: "Industrial Flooring",
    title: "Industrial Flooring & Heavy-Duty Protection",
    interpretation:
      "Concrete dusting, chemical corrosion from oils or acids, mechanical impact, and forklift tire abrasion degrading standard slab surfaces.",
    solution:
      "Diamond grinding to CSP-3 profile, control joint rebuilding with flexible polyurea, penetrating epoxy primer, and application of self-leveling heavy-duty epoxy or polyurethane screed.",
    product: "Sikafloor 264 / Sikafloor 20 PurCem Polyurethane Screed",
  },
  {
    key: "concrete",
    label: "Concrete Repair",
    title: "Concrete Repair & Structural Strengthening",
    interpretation:
      "Structural load cracking, carbonation-induced concrete spalling with corroded rebar, beam/column honeycombing, or loss of sectional capacity.",
    solution:
      "Chiseling to sound substrate, abrasive rebar derusting, zinc-rich active anti-corrosion rebar primer, high-strength shrinkage-compensated thixotropic mortar, and optional CFRP composite wrapping.",
    product: "Sika MonoTop 612 / Sikadur 31 Epoxy Adhesive & SikaWrap CFRP",
  },
  {
    key: "tank",
    label: "Water Tank",
    title: "Water Tank & Sump Protection",
    interpretation:
      "Loss of potable water through porous cast joints, tie-rod holes, or pipe penetration collars, coupled with potential algae growth and hydrostatic dampness in adjoining walls.",
    solution:
      "Pressure cleaning, corner fillet chamfering with non-shrink mortar, swellable hydrophilic waterstop collars around inlet/outlet pipes, and two coats of certified non-toxic potable-safe cementitious slurry.",
    product: "SikaTop Seal 107 (Potable Water Certified - Safe for Drinking Water)",
  },
  {
    key: "bathroom",
    label: "Bathroom Seepage",
    title: "Bathroom Seepage (Non-Destructive)",
    interpretation:
      "Water leaking into ground-floor ceilings or adjoining room baseboards through deteriorated tile grout, porous screed, or leaking P-trap drain collars.",
    solution:
      "Raking out degraded tile joints, applying deep-penetrating transparent hydrophobic elastomeric nano-sealant over tiles, and installing chemical injection grouting without breaking expensive sanitary fittings.",
    product: "SikaCeram Tile Grout / Transparent Hydrophobic Penetrating Sealant",
  },
];

export function CreteAssistant() {
  const { inspect } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<AssistantCase | null>(null);
  const [customQuery, setCustomQuery] = useState("");
  const [customInterpretation, setCustomInterpretation] = useState("");
  const [inputVal, setInputVal] = useState("");

  const panelRef = useRef<HTMLDivElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const phone = contact.whatsapp || "923008548956";
  const makeWaUrl = (message: string) =>
    `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  // Outside click & Escape to close
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        isOpen &&
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        launcherRef.current &&
        !launcherRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
        launcherRef.current?.focus();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [isOpen]);

  function handleSelectQuestion(c: AssistantCase) {
    setSelectedCase(c);
    setCustomQuery("");
    setCustomInterpretation("");
  }

  function handleKeywordMatch(query: string): AssistantCase | null {
    const q = query.toLowerCase();
    if (/roof|terrace|chhat|parapet/.test(q)) {
      return PREDEFINED_QUESTIONS.find((item) => item.key === "roof") || null;
    }
    if (/basement|underground|negative|retaining/.test(q)) {
      return PREDEFINED_QUESTIONS.find((item) => item.key === "basement") || null;
    }
    if (/wall|damp|moisture|seep|efflorescence|paint|plaster/.test(q)) {
      return PREDEFINED_QUESTIONS.find((item) => item.key === "wall") || null;
    }
    if (/floor|factory|industrial|epoxy|screed/.test(q)) {
      return PREDEFINED_QUESTIONS.find((item) => item.key === "floor") || null;
    }
    if (/concrete|crack|column|beam|spall|rebar/.test(q)) {
      return PREDEFINED_QUESTIONS.find((item) => item.key === "concrete") || null;
    }
    if (/tank|overhead|underground|sump|potable/.test(q)) {
      return PREDEFINED_QUESTIONS.find((item) => item.key === "tank") || null;
    }
    if (/bath|washroom|toilet|tile|grout/.test(q)) {
      return PREDEFINED_QUESTIONS.find((item) => item.key === "bathroom") || null;
    }
    return null;
  }

  function handleSend(e?: FormEvent) {
    if (e) e.preventDefault();
    const q = inputVal.trim();
    if (!q) return;

    const matched = handleKeywordMatch(q);
    if (matched) {
      setSelectedCase(matched);
      setCustomQuery(q);
      setCustomInterpretation(
        `Based on your description ("${q}"), the symptoms align closely with ${matched.title.toLowerCase()}.`
      );
    } else {
      setSelectedCase({
        key: "custom",
        label: "General Inquiry",
        title: "Technical Diagnostic Scan Required",
        interpretation: `For your specified requirement ("${q}"), moisture pathways and structural substrates require physical testing with electronic moisture meters and thermal diagnostics before chemical selection.`,
        solution:
          "CRETE-CHEM civil engineers deploy on-site diagnostics to isolate active hydrostatic pressure, substrate contamination, and crack dynamics to formulate a custom technical specification.",
        product: "Engineered Sika Chemical Specification (Custom Formulation)",
      });
      setCustomQuery(q);
      setCustomInterpretation("");
    }
    setInputVal("");
  }

  return (
    <div className="crete-chat-launcher-wrap">
      {/* Primary Floating Launcher Button */}
      <button
        ref={launcherRef}
        type="button"
        className="assistant-primary-launcher"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={
          isOpen
            ? "Close CRETE-CHEM technical assistant"
            : "Open CRETE-CHEM technical assistant"
        }
        aria-expanded={isOpen}
        title="CRETE-CHEM Technical Assistant"
      >
        {/* Clear Robot / Assistant SVG Icon */}
        <svg
          className="cc-launcher-icon"
          viewBox="0 0 48 48"
          aria-hidden="true"
          focusable="false"
          width="32"
          height="32"
        >
          {/* Antenna */}
          <line
            x1="24"
            y1="6"
            x2="24"
            y2="13"
            stroke="#001C2C"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <circle cx="24" cy="5" r="3" fill="#001C2C" />

          {/* Ears/Side Sensors */}
          <rect x="6" y="21" width="5" height="12" rx="2.5" fill="#001C2C" />
          <rect x="37" y="21" width="5" height="12" rx="2.5" fill="#001C2C" />

          {/* Robot Head Outer */}
          <rect
            x="10"
            y="13"
            width="28"
            height="26"
            rx="7"
            fill="#001C2C"
          />

          {/* Face Screen */}
          <rect
            x="14"
            y="17"
            width="20"
            height="18"
            rx="4"
            fill="#061D38"
          />

          {/* Glowing Cyan Eyes */}
          <circle cx="19" cy="24" r="2.5" fill="#00D9FF" />
          <circle cx="29" cy="24" r="2.5" fill="#00D9FF" />

          {/* Friendly Mouth Smile */}
          <path
            d="M20 30c1.2 1.5 2.8 2 4 2s2.8-.5 4-2"
            stroke="#00D9FF"
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </button>

      {/* Floating Assistant Panel */}
      {isOpen && (
        <div
          ref={panelRef}
          className="cc-panel-container"
          role="dialog"
          aria-label="CRETE-CHEM AI Engineering Assistant"
        >
          {/* Header */}
          <div className="cc-chat-head">
            <div className="cc-chat-head-info">
              <div className="cc-chat-avatar">
                <Sparkles size={20} />
              </div>
              <div>
                <div className="cc-chat-title">CRETE-CHEM Assistant</div>
                <div className="cc-chat-sub">Technical guidance &amp; WhatsApp support</div>
              </div>
            </div>
            <button
              type="button"
              className="cc-close-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Close assistant"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="cc-chat-body">
            {!selectedCase ? (
              <>
                <div className="cc-chat-message bot">
                  Hello! I am your CRETE-CHEM technical assistant. Select a problem area below or describe your project requirement:
                </div>

                {/* Predefined Questions Grid */}
                <div className="cc-chat-actions">
                  {PREDEFINED_QUESTIONS.map((item) => (
                    <div key={item.key} className="cc-question-row">
                      <button
                        type="button"
                        className="cc-chat-chip cc-question-btn"
                        onClick={() => handleSelectQuestion(item)}
                      >
                        {item.label}
                      </button>
                      <a
                        className="cc-question-wa"
                        href={makeWaUrl(
                          `Hello CRETE-CHEM, I have an issue with ${item.title}. Please guide me on the recommended solution and inspection.`
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`WhatsApp about ${item.title}`}
                        title={`WhatsApp about ${item.title}`}
                      >
                        <MessageCircle size={18} />
                      </a>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                {/* User Query or Category Title */}
                <div className="cc-chat-message user">
                  {customQuery ? `"${customQuery}"` : selectedCase.title}
                </div>

                {/* Structured Engineering Response (Not plain text) */}
                <div className="cc-chat-recommend space-y-3">
                  <div className="border-b border-[#1B5A86]/60 pb-2">
                    <span className="text-white font-bold text-sm">
                      {selectedCase.title}
                    </span>
                  </div>

                  {/* 1. Problem Interpretation */}
                  <div>
                    <div className="flex items-center gap-1.5 text-[#00D9FF] text-[11px] font-bold uppercase tracking-wider mb-1">
                      <AlertTriangle size={13} className="text-[#f97316]" />
                      <span>Problem Interpretation</span>
                    </div>
                    <p className="text-[#DDECF5] text-xs leading-relaxed">
                      {customInterpretation || selectedCase.interpretation}
                    </p>
                  </div>

                  {/* 2. Suggested Solution */}
                  <div>
                    <div className="flex items-center gap-1.5 text-[#00D9FF] text-[11px] font-bold uppercase tracking-wider mb-1">
                      <Wrench size={13} className="text-[#00D9FF]" />
                      <span>Suggested Solution</span>
                    </div>
                    <p className="text-[#DDECF5] text-xs leading-relaxed">
                      {selectedCase.solution}
                    </p>
                  </div>

                  {/* 3. Recommended Product / System */}
                  <div className="bg-[#061A35] border border-[#1B5A86] p-2.5 rounded-lg">
                    <div className="flex items-center gap-1.5 text-[#20C76A] text-[11px] font-bold uppercase tracking-wider mb-1">
                      <ShieldCheck size={14} />
                      <span>Recommended Product / System</span>
                    </div>
                    <p className="text-white font-semibold text-xs leading-snug">
                      {selectedCase.product}
                    </p>
                  </div>
                </div>

                {/* 4. Clearly Green WhatsApp Button with small WhatsApp Icon */}
                <a
                  className="cc-wa crete-whatsapp-cta"
                  href={makeWaUrl(
                    `Hello CRETE-CHEM, I would like expert advice on ${selectedCase.title}. Context: ${
                      customQuery || selectedCase.label
                    }. Recommended: ${selectedCase.product}. Please advise next steps.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle size={22} className="flex-none" />
                  <div className="flex flex-col text-left leading-tight">
                    <span className="font-bold text-white text-[14px]">WhatsApp CRETE-CHEM</span>
                    <small className="text-[#d7f9e3] text-[11px]">
                      Chat with an engineer about {selectedCase.label}
                    </small>
                  </div>
                </a>

                {/* Secondary Inspection CTA */}
                <button
                  type="button"
                  className="cc-inspect-btn"
                  onClick={() => {
                    setIsOpen(false);
                    inspect();
                    const contactElem =
                      document.getElementById("contact") ||
                      document.getElementById("request-inspection");
                    contactElem?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  <span>Request Free Site Inspection</span>
                  <ArrowRight size={16} />
                </button>

                {/* Back Link */}
                <div className="cc-back-row">
                  <button
                    type="button"
                    className="cc-back-btn"
                    onClick={() => {
                      setSelectedCase(null);
                      setCustomQuery("");
                      setCustomInterpretation("");
                    }}
                  >
                    ← Back to all questions
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Chat Input Footer */}
          <form className="cc-chat-input" onSubmit={handleSend}>
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Describe your leakage or project problem..."
              aria-label="Describe your problem"
            />
            <button
              type="submit"
              className="cc-send"
              aria-label="Send message"
              disabled={!inputVal.trim()}
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
