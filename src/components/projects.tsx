"use client";

import { useState } from "react";
import Image from "next/image";
import {
  MapPin,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  MessageSquare,
  X,
  Building2,
  CheckCircle2,
  Layers,
  ChevronRight,
} from "lucide-react";
import { Modal } from "@/components/ui";
import { useStore } from "@/components/store-provider";
import { contact } from "@/lib/seed";

export interface ProjectItem {
  id: string;
  badge: string;
  category: string;
  location: string;
  scopeArea: string;
  title: string;
  description: string;
  image: string;
  sector: string;
  systems: string[];
  specs: {
    substrate: string;
    application: string;
    warranty: string;
    standard: string;
  };
}

const COMPLETED_PROJECTS: ProjectItem[] = [
  {
    id: "proj-1",
    badge: "Roof Waterproofing",
    category: "Liquid-Applied Membrane",
    location: "PAF Base Nur Khan, Islamabad",
    scopeArea: "13,000 SFT Tarmac / 45,000 SFT Total",
    title: "Roof Treatment with Sikalastic 510",
    description:
      "PAF Base Nur Khan — Joint filling, perimeter detailing, and slab waterproofing at the critical tarmac area using elastomeric polyurethane systems.",
    image: "/assets/projects/roof-waterproofing.webp",
    sector: "Defense & Aviation Infrastructure",
    systems: [
      "Sikalastic 510 Polyurethane Membrane",
      "Sika Primer-11 W Substrate Conditioner",
      "Sikaflex Construction Sealant for Joints",
    ],
    specs: {
      substrate: "Reinforced Concrete Tarmac & Roof Slab",
      application: "Multi-Coat Liquid Applied Elastomeric System",
      warranty: "10-Year Leak-Free Workmanship Warranty",
      standard: "ASTM C836 / Sika Specification Standard",
    },
  },
  {
    id: "proj-2",
    badge: "Runway & Joint Sealing",
    category: "Heavy-Duty Joint Sealant",
    location: "Zhob Airbase, Balochistan",
    scopeArea: "600,000 SFT Heavy-Duty Pavement",
    title: "Joint Filling & Slab Treatment",
    description:
      "Zhob Airbase — Comprehensive heavy-duty runway repair, slab rehabilitation, and expansion joint sealing under extreme thermal expansion cycles.",
    image: "/assets/projects/runway-joint-sealing.webp",
    sector: "Military Airfield & Concrete Pavements",
    systems: [
      "Sikaflex Heavy-Duty Polyurethane Joint Sealant",
      "High-Density Closed-Cell Backer Rods",
      "Elastomeric Edge Protection Primers",
    ],
    specs: {
      substrate: "High-Strength Airfield Pavement Concrete",
      application: "Precision Mechanical Joint Injection & Curing",
      warranty: "5 to 10-Year Heavy Traffic Guarantee",
      standard: "FAA & ASTM D5893 Airport Joint Standards",
    },
  },
  {
    id: "proj-3",
    badge: "Leveling & Coating",
    category: "Structural Repair & Protection",
    location: "Artillery Mess, Rawalpindi",
    scopeArea: "50,000 SFT Structural Floor",
    title: "Repair of Runway & Artillery Mess",
    description:
      "Artillery Mess, Rawalpindi — Non-shrink precision leveling concrete combined with a seamless Sikalastic 510 protective barrier coating.",
    image: "/assets/projects/concrete-leveling.webp",
    sector: "Institutional & Military Infrastructure",
    systems: [
      "Sika Level-30 High-Performance Leveling Mortar",
      "Sikalastic 510 Protective Topcoat",
      "SikaTop Seal-107 Moisture Barrier",
    ],
    specs: {
      substrate: "Aged Concrete Slab & High-Traffic Floors",
      application: "Surface Profiling, Non-Shrink Mortar, Topcoat",
      warranty: "10-Year Structural Protection Guarantee",
      standard: "BS EN 1504 Concrete Repair Compliant",
    },
  },
  {
    id: "proj-4",
    badge: "Structural Repair",
    category: "CFRP Structural Strengthening",
    location: "Gadoon Textile Mills, KPK",
    scopeArea: "Industrial Heavy Machinery Span",
    title: "Structure Repair with Carbon-Fibre",
    description:
      "Gadoon Textile Mills — Structural load-capacity upgrade and flexural beam reinforcement using high-tensile carbon-fibre composite systems.",
    image: "/assets/projects/cfrp-structural-repair.webp",
    sector: "Heavy Textile & Manufacturing Industry",
    systems: [
      "SikaWrap Carbon-Fibre Unidirectional Fabrics",
      "Sikadur-330 Structural Epoxy Impregnating Resin",
      "Sikadur-31 Epoxy Repair & Patching Paste",
    ],
    specs: {
      substrate: "Reinforced Concrete Beams & Load-Bearing Columns",
      application: "Surface Grinding, Primer & Wet Layup CFRP Wrapping",
      warranty: "Certified Structural Upgrade Lifetime Rating",
      standard: "ACI 440.2R & FIB Bulletin 14 Compliant",
    },
  },
  {
    id: "proj-5",
    badge: "CFRP Strips & Wrap",
    category: "Carbon-Fibre Plate Reinforcement",
    location: "Textile Mill, Faisalabad",
    scopeArea: "Precast Concrete Girders",
    title: "Structure Repair with CFRP Strips & Wrap",
    description:
      "Industrial Textile Mill — Precast concrete girder strengthening and seismic shear retrofitting using structural carbon-fibre laminates and wrap.",
    image: "/assets/projects/cfrp-girder-wrap.webp",
    sector: "Industrial Processing & Precast Spans",
    systems: [
      "Sika CarboDur Structural CFRP Laminates / Plates",
      "Sikadur-30 High-Modulus Structural Adhesive",
      "SikaWrap Bi-Directional Carbon Fabric",
    ],
    specs: {
      substrate: "Pre-stressed & Precast Structural Girders",
      application: "Bonded Plate Technology & External Confinement",
      warranty: "10-Year Engineered Performance Guarantee",
      standard: "ASTM D3039 / Sika Engineering Specification",
    },
  },
  {
    id: "proj-6",
    badge: "Girder Re-strengthening",
    category: "Reinforced Membrane & Grouting",
    location: "MH / CMH, Nationwide Pakistan",
    scopeArea: "235,000 SFT Roof & Girders",
    title: "Re-strengthening of Precast Girders",
    description:
      "Military Hospitals (MH / CMH) — Heavy roof treatment with fibre mesh reinforcement, pressure grouting, and precast girder structural stabilization.",
    image: "/assets/projects/girder-restrengthening.webp",
    sector: "Healthcare & Critical Public Facilities",
    systems: [
      "High-Tensile Fibre Mesh Insertion Matrix",
      "Sika Grout-214 High-Strength Precision Grout",
      "Sikalastic Elastomeric Hybrid Barrier",
    ],
    specs: {
      substrate: "Precast Hospital Roof Girders & Decking",
      application: "Fibre Reinforcement & High-Pressure Grouting",
      warranty: "10-Year Leak-Free & Structural Guarantee",
      standard: "ASTM C1107 & ISO 9001:2015 Execution",
    },
  },
];

export function ProjectsGrid() {
  const { inspect } = useStore();
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  const whatsappProjectInquiry = (proj: ProjectItem) => {
    return encodeURIComponent(
      `Hello CRETE-CHEM team, I saw your documented project: "${proj.title}" at "${proj.location}". I need a similar engineering assessment and site inspection for our facility.`
    );
  };

  return (
    <>
      <section
        id="projects"
        className="bg-[#061A35] text-white py-16 lg:py-24 border-t border-[#1B5A86]/40 relative overflow-hidden"
      >
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
            <span className="inline-block px-3.5 py-1 rounded-full bg-[#0A2344] border border-[#1B5A86] text-[#00D9FF] text-[11px] font-bold uppercase tracking-widest mb-3 shadow-sm">
              PORTFOLIO / COMPLETED PROJECTS
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Completed Projects
            </h2>
            <p className="text-[#9FB7CF] text-base sm:text-lg mt-3.5 leading-relaxed">
              Documented engineering scopes delivered across waterproofing, structural repair and construction chemical applications across Pakistan.
            </p>
          </div>

          {/* 6 Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
            {COMPLETED_PROJECTS.map((p) => (
              <div
                key={p.id}
                onClick={() => setSelectedProject(p)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelectedProject(p);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`View case study for ${p.title}`}
                className="bg-[#0A2344] border border-[#1B5A86]/80 hover:border-[#00D9FF] rounded-xl overflow-hidden transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.25)] hover:shadow-[0_12px_32px_rgba(0,168,255,0.14)] hover:-translate-y-1 group flex flex-col cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-[#00D9FF]"
              >
                {/* Image Container */}
                <div className="relative h-56 sm:h-60 w-full overflow-hidden bg-[#071D38]">
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Subtle edge gradient to preserve image clarity while ensuring tag legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#061A35]/80 via-transparent to-transparent pointer-events-none" />

                  {/* Top-Left Category Badge */}
                  <div className="absolute top-3 left-3 bg-[#061A35]/95 backdrop-blur-sm border border-[#1B5A86] text-[#00D9FF] text-[11px] font-bold px-2.5 py-1 rounded shadow-sm">
                    {p.badge}
                  </div>

                  {/* Top-Right Scope Pill */}
                  <div className="absolute top-3 right-3 bg-[#071D38]/90 backdrop-blur-sm border border-[#1B5A86]/70 text-[#EAF5FF] text-[10px] font-semibold px-2 py-0.5 rounded shadow-sm">
                    {p.scopeArea.split("/")[0].trim()}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Location & Indicator */}
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[#00A8FF] mb-2">
                      <MapPin size={14} className="shrink-0 text-[#00D9FF]" />
                      <span className="truncate">{p.location}</span>
                    </div>

                    {/* Project Title */}
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-2 leading-snug group-hover:text-[#00D9FF] transition-colors">
                      {p.title}
                    </h3>

                    {/* Engineering Scope Description */}
                    <p className="text-xs sm:text-sm text-[#9FB7CF] leading-relaxed mb-4 line-clamp-3">
                      {p.description}
                    </p>
                  </div>

                  {/* Bottom Bar: Action Link + Scope Metadata */}
                  <div className="pt-3.5 border-t border-[#1B5A86]/50 flex items-center justify-between w-full mt-auto">
                    <span className="text-xs font-bold text-[#00D9FF] flex items-center gap-1.5 group-hover:text-white transition-colors">
                      <span>View Engineering Scope</span>
                      <ArrowRight
                        size={14}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </span>
                    <span className="text-[11px] font-medium text-[#84A3C1] bg-[#071D38] px-2 py-0.5 rounded border border-[#1B5A86]/50">
                      Case Study
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Warranty / Trust Credibility Strip */}
          <div className="mt-12 lg:mt-14 bg-[#0A2344] border border-[#1B5A86]/80 rounded-xl p-5 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#071D38] border border-[#1B5A86] flex items-center justify-center shrink-0">
                <ShieldCheck size={22} className="text-[#00D9FF]" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">
                  All completed projects include a certified 5 to 10 Year Workmanship &amp; Leak-Free Guarantee.
                </p>
                <p className="text-xs text-[#84A3C1] mt-0.5">
                  ASTM &amp; Sika Application Compliant • 500+ Projects Completed Across Pakistan
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => inspect("roof-waterproofing")}
              className="shrink-0 px-4 py-2.5 rounded-lg bg-[#071D38] hover:bg-[#00D9FF] hover:text-[#061A35] border border-[#1B5A86] hover:border-[#00D9FF] text-xs font-bold text-[#00A8FF] hover:text-[#061A35] transition-all cursor-pointer flex items-center gap-2"
            >
              <Sparkles size={14} />
              <span>Book Site Inspection</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* CASE STUDY DETAIL MODAL (Industrial Engineering Architecture)       */}
      {/* =================================================================== */}
      {selectedProject && (
        <Modal
          title={selectedProject.title}
          onClose={() => setSelectedProject(null)}
          maxWidth="780px"
          className="industrial-modal"
          hideDefaultHeading={true}
        >
          {/* Modal Header */}
          <div className="p-4 sm:p-5 bg-[#061A32] border-b border-[#1B5A86]/40 flex items-start justify-between gap-3 sticky top-0 z-20">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#00D9FF]">
                  DOCUMENTED CASE STUDY
                </span>
                <span className="text-[10px] text-[#84A3C1]">•</span>
                <span className="text-[10px] text-[#84A3C1]">
                  {selectedProject.sector}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                {selectedProject.title}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setSelectedProject(null)}
              className="w-9 h-9 rounded-full bg-[#0B2D4C] hover:bg-[#00D9FF] text-white hover:text-[#061A35] flex items-center justify-center transition-colors cursor-pointer border border-[#1B5A86]/40 text-lg font-bold shrink-0"
              aria-label="Close project modal"
            >
              <X size={18} />
            </button>
          </div>

          <div className="p-5 sm:p-6 space-y-5 max-h-[calc(85vh-90px)] overflow-y-auto">
            {/* Real Project Image Banner */}
            <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden bg-[#071D38] border border-[#1B5A86]">
              <Image
                src={selectedProject.image}
                alt={selectedProject.title}
                fill
                sizes="(max-width: 780px) 100vw, 780px"
                className="object-cover"
              />
              <div className="absolute top-3 left-3 bg-[#061A35]/95 backdrop-blur-sm border border-[#1B5A86] text-[#00D9FF] text-xs font-bold px-3 py-1 rounded">
                {selectedProject.badge}
              </div>
              <div className="absolute bottom-3 left-3 right-3 bg-[#061A35]/90 backdrop-blur-sm border border-[#1B5A86]/60 p-2.5 rounded-lg flex items-center justify-between text-xs text-white">
                <span className="flex items-center gap-1.5 text-[#00A8FF]">
                  <MapPin size={14} className="text-[#00D9FF]" />
                  <span>{selectedProject.location}</span>
                </span>
                <span className="font-semibold text-[#84A3C1]">
                  {selectedProject.scopeArea}
                </span>
              </div>
            </div>

            {/* Engineering Summary */}
            <div className="bg-[#071D38] rounded-xl p-4 sm:p-5 border border-[#1B5A86]/80">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#00D9FF] mb-2 flex items-center gap-2">
                <Building2 size={15} /> Documented Project Scope
              </h4>
              <p className="text-sm text-[#EAF5FF] leading-relaxed">
                {selectedProject.description}
              </p>
            </div>

            {/* Prescribed Chemical Systems */}
            <div className="bg-[#071D38] rounded-xl p-4 sm:p-5 border border-[#1B5A86]/80">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#00D9FF] mb-3 flex items-center gap-2">
                <Layers size={15} /> Applied Sika Chemical Systems
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {selectedProject.systems.map((sys, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 bg-[#0A2344] p-2.5 rounded-lg border border-[#1B5A86]/60 text-xs text-white"
                  >
                    <CheckCircle2 size={15} className="text-[#00D9FF] shrink-0 mt-0.5" />
                    <span>{sys}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Engineering Specifications Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-[#0A2344] p-3.5 rounded-lg border border-[#1B5A86]/60">
                <span className="text-[#84A3C1] block mb-1 uppercase text-[10px] font-bold">
                  Substrate Evaluated
                </span>
                <span className="text-white font-semibold">
                  {selectedProject.specs.substrate}
                </span>
              </div>
              <div className="bg-[#0A2344] p-3.5 rounded-lg border border-[#1B5A86]/60">
                <span className="text-[#84A3C1] block mb-1 uppercase text-[10px] font-bold">
                  Methodology
                </span>
                <span className="text-white font-semibold">
                  {selectedProject.specs.application}
                </span>
              </div>
              <div className="bg-[#0A2344] p-3.5 rounded-lg border border-[#1B5A86]/60">
                <span className="text-[#84A3C1] block mb-1 uppercase text-[10px] font-bold">
                  Certified Standards
                </span>
                <span className="text-white font-semibold">
                  {selectedProject.specs.standard}
                </span>
              </div>
              <div className="bg-[#0A2344] p-3.5 rounded-lg border border-[#1B5A86]/60">
                <span className="text-[#84A3C1] block mb-1 uppercase text-[10px] font-bold">
                  Workmanship Warranty
                </span>
                <span className="text-[#20C76A] font-bold flex items-center gap-1">
                  <ShieldCheck size={14} />
                  <span>{selectedProject.specs.warranty}</span>
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-[#1B5A86]/40 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-[#00A8FF] hover:bg-[#00D9FF] text-[#061A35] font-bold text-sm transition-all shadow-md cursor-pointer"
                onClick={() => {
                  setSelectedProject(null);
                  inspect("roof-waterproofing");
                }}
              >
                <Sparkles size={16} />
                <span>Request Similar Site Inspection</span>
              </button>

              <a
                href={`https://wa.me/${contact.whatsapp}?text=${whatsappProjectInquiry(selectedProject)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-[#16A34A] hover:bg-[#20C96A] text-white font-bold text-sm transition-colors cursor-pointer"
              >
                <MessageSquare size={16} />
                <span>WhatsApp Case Inquiry</span>
              </a>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

