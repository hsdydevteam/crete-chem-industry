import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  ShieldCheck,
  Users,
  Layers,
  Clock3,
  Headphones,
  Building2,
  House,
  Factory,
  HardHat,
  Warehouse,
  Cog,
  HeartPulse,
  GraduationCap,
  Hotel,
  Store,
  FileCheck,
  Globe,
  PhoneCall,
  Search,
  FileText,
  Wrench,
  CheckCheck,
  MessageCircle,
} from "lucide-react";
import { Instagram, Facebook, Linkedin } from "./social-icons";
import { cities, contact } from "@/lib/seed";
import { SectionHeading } from "./ui";
import { Brand } from "./site-header";
import { HeroTypingText } from "./hero-typing";

export function HeroSection({
  products: _products,
  services: _services,
}: {
  products: number;
  services: number;
}) {
  return (
    <section className="hero-reference" id="home">
      {/* Desktop Hero Background Image (Active at 980px+) */}
      <div className="hero-bg desktop-hero-bg">
        <Image
          src="/assets/hero-waterproofing-desktop.webp"
          alt="CRETE-CHEM waterproofing specialists applying protective membrane on rooftop"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 1600px"
          className="hero-image"
          quality={85}
        />
      </div>
      <div className="hero-overlay desktop-hero-overlay" />

      <div className="crete-container hero-content">
        <div className="hero-copy">
          {/* 1. Trust / Authorized Sika badge */}
          <div
            className="hero-eyebrow hero-verification"
            aria-label="Authorized Sika Agent — Verified"
          >
            <span className="verify-badge">
              <ShieldCheck size={16} className="text-[#00D9FF]" />
              <b>AUTHORIZED SIKA AGENT</b>
            </span>
            <span className="verify-divider" aria-hidden="true" />
            <span className="verify-badge verify-badge-cyan">
              <CheckCircle2 size={16} className="text-[#20C76A]" />
              <b>VERIFIED</b>
            </span>
          </div>

          {/* 2. Headline */}
          <h1>
            Stronger Structures.
            <br />
            <HeroTypingText text="Leak-Free Living." />
          </h1>

          {/* 3. Short supporting text */}
          <p>
            Waterproofing, construction chemicals, repair and specialist
            solutions for homes, buildings and infrastructure across Pakistan.
          </p>

          {/* 4. CTA buttons */}
          <div className="hero-buttons">
            <a className="primary-hero-btn" href="#request-inspection">
              <span>Get Free Inspection</span>
              <span aria-hidden="true">↗</span>
            </a>
            <a className="secondary-hero-btn" href="#services-catalog">
              <span>Explore Solutions</span>
              <span aria-hidden="true">→</span>
            </a>
          </div>

          {/* 5. Mobile Hero Engineering Image / Visual Proof (Active on mobile screens < 980px) */}
          <div className="mobile-hero-visual" aria-hidden="false">
            <div className="mobile-hero-image-wrap">
              <Image
                src="/assets/hero-waterproofing-mobile.webp"
                alt="CRETE-CHEM waterproofing specialists applying protective membrane on rooftop"
                width={768}
                height={432}
                priority
                sizes="(max-width: 768px) 100vw, 768px"
                className="mobile-hero-img"
                quality={85}
              />
              <div className="mobile-hero-badge">
                <span className="w-2 h-2 rounded-full bg-[#00D9FF] inline-block animate-pulse" />
                <span>On-Site Waterproofing Application</span>
              </div>
            </div>
          </div>

          {/* Benefits Strip */}
          <div className="hero-benefits">
            <div>
              <span className="benefit-icon">
                <Check size={15} />
              </span>
              <div>
                <strong>Site Inspection</strong>
                <small>Free Consultation</small>
              </div>
            </div>
            <div>
              <span className="benefit-icon">
                <Users size={15} />
              </span>
              <div>
                <strong>Expert Team</strong>
                <small>Technical Support</small>
              </div>
            </div>
            <div>
              <span className="benefit-icon">
                <ShieldCheck size={15} />
              </span>
              <div>
                <strong>Long-Term Protection</strong>
                <small>Reliable &amp; Durable</small>
              </div>
            </div>
          </div>
        </div>

        {/* 6. Compact proof/statistics */}
        <div className="hero-stat-card">
          <div>
            <strong>SIKA</strong>
            <span>Authorized Agent</span>
          </div>
          <div>
            <strong>C6</strong>
            <span>PEC Category</span>
          </div>
          <div>
            <strong>15+</strong>
            <span>Years Experience</span>
          </div>
        </div>
      </div>
    </section>
  );
}
export function TrustSection() {
  const trustFeatures = [
    {
      icon: ShieldCheck,
      title: "Authorized Site Assessment",
      desc: "Detailed moisture mapping, infrared thermal scans, and substrate inspection before any work begins.",
    },
    {
      icon: Users,
      title: "Expert Application Team",
      desc: "Certified civil applicators trained under manufacturer standards with rigorous field safety SOPs.",
    },
    {
      icon: Layers,
      title: "Quality Products",
      desc: "Genuine Sika-approved and lab-tested chemical batches delivered with verifiable test certificates.",
    },
    {
      icon: CheckCircle2,
      title: "Tested Systems",
      desc: "Proven waterproofing and structural injection systems verified through rigorous 72-hour ponding tests.",
    },
    {
      icon: Clock3,
      title: "Reliable Service",
      desc: "Punctual milestone delivery, seamless procurement, and disciplined site coordination without project overrun.",
    },
    {
      icon: Headphones,
      title: "After Sales Support",
      desc: "Documented 5 to 10-year service warranty certificates backed by dedicated emergency maintenance teams.",
    },
  ];

  return (
    <section id="about" className="trust-section-ref bg-[#061A35] text-white py-16 lg:py-20 border-t border-[#1B5A86]/40">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: 40% on Desktop */}
          <div className="lg:col-span-5 space-y-6">
            <span className="inline-block px-3 py-1 rounded bg-[#0A2344] border border-[#1B5A86] text-[#00D9FF] text-[11px] font-bold uppercase tracking-widest">
              WHY CHOOSE US
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Trusted. Tested.<br />
              <span className="text-[#00D9FF]">Recommended.</span>
            </h2>
            <p className="text-[#9FB7CF] text-base leading-relaxed">
              With over 15 years of experience in construction chemicals, we deliver professional solutions that stand the test of time. Our team uses only the highest quality Sika-approved products, ensuring every project meets international standards for durability and performance.
            </p>

            {/* Stats Row */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 pt-4 border-t border-[#1B5A86]/40">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-full bg-[#00A8FF]/20 border border-[#00A8FF] flex items-center justify-center text-[#00D9FF] font-black text-xl shrink-0">
                  15+
                </div>
                <div>
                  <p className="text-white font-bold text-base leading-snug">Years Experience</p>
                  <p className="text-xs text-[#7895AE]">In Construction Chem</p>
                </div>
              </div>
              <div className="hidden sm:block w-px h-10 bg-[#1B5A86]" />
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-full bg-[#16A34A]/20 border border-[#16A34A] flex items-center justify-center text-[#20C76A] font-black text-xl shrink-0">
                  500+
                </div>
                <div>
                  <p className="text-white font-bold text-base leading-snug">Projects Completed</p>
                  <p className="text-xs text-[#7895AE]">Nationwide Pakistan</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 60% on Desktop, 6 Compact Trust Cards */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {trustFeatures.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-[#0A2344] border border-[#1B5A86] rounded-xl p-5 hover:border-[#00D9FF] hover:bg-[#0D2D52] transition-all duration-200 shadow-md group"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#061A35] border border-[#1B5A86] flex items-center justify-center text-[#00D9FF] mb-3 group-hover:scale-105 transition-transform">
                    <Icon size={20} />
                  </div>
                  <h3 className="text-base font-bold text-white mb-1.5 leading-snug">{item.title}</h3>
                  <p className="text-xs text-[#9FB7CF] leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export function ProcessSection() {
  const steps = [
    {
      step: "01",
      icon: PhoneCall,
      title: "Contact",
      desc: "Reach us via WhatsApp or phone call to schedule your visit.",
    },
    {
      step: "02",
      icon: Search,
      title: "Free Inspection",
      desc: "We inspect your site, perform moisture testing & map seepage sources.",
    },
    {
      step: "03",
      icon: FileText,
      title: "Solution & Quote",
      desc: "Engineered proposal with transparent specifications and fixed pricing.",
    },
    {
      step: "04",
      icon: Wrench,
      title: "Professional Application",
      desc: "Certified Sika crew executes the substrate prep and chemical application.",
    },
    {
      step: "05",
      icon: CheckCheck,
      title: "Quality Check",
      desc: "72-hour ponding test and electronic leak verification prior to handoff.",
    },
    {
      step: "06",
      icon: ShieldCheck,
      title: "Long-Term Protection",
      desc: "Official 5-10 year warranty certificate & ongoing technical support.",
    },
  ];

  return (
    <section id="process" className="bg-[#071D38] text-white py-16 lg:py-20 border-t border-[#1B5A86]/40">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block px-3 py-1 rounded bg-[#0A2344] border border-[#1B5A86] text-[#00D9FF] text-[11px] font-bold uppercase tracking-widest mb-3">
            HOW WE WORK
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Our Process</h2>
          <p className="text-[#9FB7CF] text-base sm:text-lg mt-3 leading-relaxed">
            From initial contact to long-term protection, we follow a proven 6-step engineering process to deliver watertight results you can trust.
          </p>
        </div>

        {/* 6-Step Horizontal Structure on Desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 relative">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.step}
                className="bg-[#0A2344] border border-[#1B5A86] rounded-xl p-4 sm:p-5 flex flex-col items-center text-center hover:border-[#00D9FF] hover:bg-[#0D2D52] transition-all duration-200 shadow-md group"
              >
                <div className="w-10 h-10 rounded-full bg-[#061A35] border border-[#1B5A86] text-[#00D9FF] font-mono font-extrabold text-sm flex items-center justify-center mb-3 group-hover:bg-[#00D9FF] group-hover:text-[#061A35] transition-colors">
                  {s.step}
                </div>
                <div className="text-[#00A8FF] group-hover:text-[#00D9FF] mb-2 transition-colors">
                  <Icon size={22} />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-white mb-1.5 leading-snug">{s.title}</h3>
                <p className="text-xs text-[#9FB7CF] leading-relaxed">{s.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Bottom Process CTA */}
        <div className="mt-12 text-center flex flex-col items-center gap-3.5 bg-[#0A2344]/80 border border-[#1B5A86] p-6 rounded-2xl max-w-2xl mx-auto shadow-lg">
          <a
            className="inline-flex items-center gap-2.5 bg-[#16A34A] hover:bg-[#20C76A] text-white font-bold text-sm px-6 py-3 rounded-lg shadow-md transition-all hover:shadow-[#16A34A]/25 hover:shadow-lg"
            href={`https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(
              "Hello CRETE-CHEM, I want to book a free site inspection under your 6-step process."
            )}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle size={18} />
            <span>WhatsApp CRETE-CHEM</span>
          </a>
          <p className="text-xs sm:text-sm text-[#9FB7CF]">
            Free site visits available across Islamabad, Rawalpindi, Lahore &amp; Karachi
          </p>
        </div>
      </div>
    </section>
  );
}

export function IndustriesGrid() {
  const topIndustries = [
    {
      title: "Residential",
      desc: "Homes, villas & housing societies",
      image: "/assets/industries/residential.webp",
      icon: House,
    },
    {
      title: "Commercial",
      desc: "Offices, malls & business centers",
      image: "/assets/industries/commercial.webp",
      icon: Building2,
    },
    {
      title: "Industrial",
      desc: "Plants, production & process areas",
      image: "/assets/industries/industrial.webp",
      icon: Factory,
    },
    {
      title: "Warehouse",
      desc: "Storage, logistics & distribution",
      image: "/assets/industries/warehouse.webp",
      icon: Warehouse,
    },
  ];

  const bottomIndustries = [
    {
      title: "Factory",
      desc: "Manufacturing & assembly units",
      image: "/assets/industries/factory.webp",
      icon: Cog,
    },
    {
      title: "Healthcare",
      desc: "Hospitals, clinics & laboratories",
      image: "/assets/industries/healthcare.webp",
      icon: HeartPulse,
    },
    {
      title: "Educational",
      desc: "Schools, colleges & universities",
      image: "/assets/industries/educational.webp",
      icon: GraduationCap,
    },
    {
      title: "Hotel",
      desc: "Hospitality & leisure facilities",
      image: "/assets/industries/hotel.webp",
      icon: Hotel,
    },
    {
      title: "Infrastructure",
      desc: "Bridges, roads & public assets",
      image: "/assets/industries/infrastructure.webp",
      icon: HardHat,
    },
    {
      title: "Retail",
      desc: "Shops, outlets & retail chains",
      image: "/assets/industries/retail.webp",
      icon: Store,
    },
  ];

  return (
    <section id="industries" className="bg-[#051329] text-white py-16 lg:py-24 border-t border-[#1B5A86]/40 relative overflow-hidden">
      {/* Background Subtle Gradient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-[#00D9FF]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-[#00D9FF]/50 bg-[#0A2344]/80 text-[#00D9FF] text-xs font-bold uppercase tracking-[0.2em] mb-4 shadow-sm">
            WHERE WE SERVE
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Industries We Serve
          </h2>
          <p className="text-[#9FB7CF] text-base sm:text-lg mt-4 leading-relaxed">
            Construction, infrastructure, food &amp; beverage, pharmaceutical, chemical, engineering, commercial and industrial environments.
          </p>
        </div>

        {/* Row 1: 4 Large Featured Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-4 sm:mb-5">
          {topIndustries.map((ind) => {
            const Icon = ind.icon;
            return (
              <a
                key={ind.title}
                href="#contact"
                className="group relative h-[300px] sm:h-[340px] lg:h-[350px] rounded-2xl overflow-hidden border border-[#1B5A86]/60 hover:border-[#00D9FF] bg-[#0A2344] flex flex-col justify-end p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#00D9FF]/15 text-left focus:outline-none focus:ring-2 focus:ring-[#00D9FF]"
                aria-label={`Get waterproofing specification for ${ind.title}`}
              >
                {/* Background Image */}
                <Image
                  src={ind.image}
                  alt={`${ind.title} - ${ind.desc}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                  priority={false}
                />

                {/* Bottom Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#041226] via-[#041226]/80 via-45% to-transparent transition-opacity duration-300 pointer-events-none" />

                {/* Content */}
                <div className="relative z-10 flex flex-col">
                  {/* Cyan Icon Box */}
                  <div className="w-10 h-10 rounded-xl bg-[#061A35]/90 border border-[#00D9FF] flex items-center justify-center text-[#00D9FF] mb-3 shadow-md group-hover:bg-[#00D9FF] group-hover:text-[#061A35] transition-all">
                    <Icon size={20} />
                  </div>

                  {/* Title & Arrow */}
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-white font-bold text-xl tracking-tight group-hover:text-[#00D9FF] transition-colors">
                      {ind.title}
                    </h3>
                    <ArrowRight size={20} className="text-[#00D9FF] group-hover:translate-x-1 transition-transform flex-shrink-0" />
                  </div>

                  {/* Description */}
                  <p className="text-[#9FB7CF] text-xs sm:text-sm mt-1 leading-snug font-normal">
                    {ind.desc}
                  </p>
                </div>
              </a>
            );
          })}
        </div>

        {/* Row 2: 6 Compact Industry Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-4">
          {bottomIndustries.map((ind) => {
            const Icon = ind.icon;
            return (
              <a
                key={ind.title}
                href="#contact"
                className="group relative h-[230px] sm:h-[250px] lg:h-[260px] rounded-2xl overflow-hidden border border-[#1B5A86]/60 hover:border-[#00D9FF] bg-[#0A2344] flex flex-col justify-end p-4 sm:p-4.5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#00D9FF]/15 text-left focus:outline-none focus:ring-2 focus:ring-[#00D9FF]"
                aria-label={`Get waterproofing specification for ${ind.title}`}
              >
                {/* Background Image */}
                <Image
                  src={ind.image}
                  alt={`${ind.title} - ${ind.desc}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16.6vw"
                  className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                  priority={false}
                />

                {/* Bottom Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#041226] via-[#041226]/85 via-50% to-transparent transition-opacity duration-300 pointer-events-none" />

                {/* Content */}
                <div className="relative z-10 flex flex-col">
                  {/* Cyan Icon Box */}
                  <div className="w-8 h-8 rounded-lg bg-[#061A35]/90 border border-[#00D9FF] flex items-center justify-center text-[#00D9FF] mb-2.5 shadow-sm group-hover:bg-[#00D9FF] group-hover:text-[#061A35] transition-all">
                    <Icon size={17} />
                  </div>

                  {/* Title & Arrow */}
                  <div className="flex items-center justify-between gap-1.5">
                    <h3 className="text-white font-bold text-base lg:text-[15px] xl:text-base tracking-tight group-hover:text-[#00D9FF] transition-colors">
                      {ind.title}
                    </h3>
                    <ArrowRight size={16} className="text-[#00D9FF] group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
                  </div>

                  {/* Description */}
                  <p className="text-[#9FB7CF] text-[11px] sm:text-xs mt-0.5 leading-tight font-normal line-clamp-2">
                    {ind.desc}
                  </p>
                </div>
              </a>
            );
          })}
        </div>

        {/* Bottom Trust & Credibility Strip */}
        <div className="mt-12 lg:mt-16 bg-[#071E3D]/80 border border-[#1B5A86]/60 rounded-2xl p-6 sm:p-7 backdrop-blur-md shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8">
          {/* 3 Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-6 sm:gap-8 w-full lg:w-auto">
            {/* Pillar 1 */}
            <div className="flex items-center gap-3.5">
              <ShieldCheck className="w-8 h-8 sm:w-9 sm:h-9 text-[#00D9FF] flex-shrink-0 stroke-[1.75]" />
              <p className="text-xs sm:text-sm font-semibold text-slate-200 leading-snug">
                Tailored chemical waterproofing specifications for every building type
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="flex items-center gap-3.5 sm:border-l sm:border-[#1B5A86]/60 sm:pl-6 lg:pl-8">
              <FileCheck className="w-8 h-8 sm:w-9 sm:h-9 text-[#00D9FF] flex-shrink-0 stroke-[1.75]" />
              <p className="text-xs sm:text-sm font-semibold text-slate-200 leading-snug">
                ASTM &amp; Sika Application Compliant
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="flex items-center gap-3.5 sm:border-l sm:border-[#1B5A86]/60 sm:pl-6 lg:pl-8">
              <Globe className="w-8 h-8 sm:w-9 sm:h-9 text-[#00D9FF] flex-shrink-0 stroke-[1.75]" />
              <p className="text-xs sm:text-sm font-semibold text-slate-200 leading-snug">
                Nationwide Project Execution
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <a
            href="#contact"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#00D9FF] hover:bg-[#38bdf8] text-[#061A35] font-extrabold text-sm sm:text-base tracking-wide transition-all shadow-lg shadow-[#00D9FF]/20 hover:shadow-cyan-400/35 transform hover:-translate-y-0.5 whitespace-nowrap flex-shrink-0 w-full sm:w-auto text-center"
          >
            <span>Get a Consultation</span>
            <ArrowRight size={18} />
          </a>
        </div>
      </div>
    </section>
  );
}

export function FinalCtaSection() {
  const phone = contact.whatsapp || "923008548956";
  const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(
    "Hello CRETE-CHEM, I would like to discuss an expert waterproofing or construction chemical requirement for my project."
  )}`;

  return (
    <section className="w-full py-16 lg:py-20 bg-[#061A35] text-white relative overflow-hidden border-t border-[#1B5A86]/40" id="final-cta">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <span className="inline-block px-3 py-1 rounded bg-[#0A2344] border border-[#1B5A86] text-[#00D9FF] text-[11px] font-bold uppercase tracking-wider mb-4">
          NATIONWIDE TECHNICAL SUPPORT &amp; INSPECTION
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight max-w-3xl mx-auto leading-tight">
          Need Expert Waterproofing or<br className="hidden sm:inline" /> Construction Chemical Solutions?
        </h2>
        <p className="text-[#9FB7CF] text-base sm:text-lg mt-4 max-w-2xl mx-auto leading-relaxed">
          Tell us about your project and our team of structural chemical engineers will recommend the exact specification and deploy site diagnostics.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
          <a
            className="inline-flex items-center gap-2 bg-[#16A34A] hover:bg-[#20C76A] text-white font-bold text-sm sm:text-base px-6 py-3.5 rounded-lg shadow-md transition-all transform hover:-translate-y-0.5"
            href={waUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            <MessageCircle size={20} />
            <span>WhatsApp CRETE-CHEM</span>
          </a>
          <a
            className="inline-flex items-center gap-2 bg-[#f97316] hover:bg-[#ea580c] text-white font-bold text-sm sm:text-base px-6 py-3.5 rounded-lg shadow-md transition-all transform hover:-translate-y-0.5"
            href="#contact"
          >
            <ShieldCheck size={20} />
            <span>Get Free Inspection</span>
          </a>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-xs sm:text-sm font-semibold text-[#9FB7CF] border-t border-[#1B5A86]/40 pt-6">
          <span className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-[#00D9FF]" /> Free On-Site Moisture Inspection
          </span>
          <span className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-[#00D9FF]" /> 5 to 10 Year Certified Warranty
          </span>
          <span className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-[#00D9FF]" /> Engineered Sika &amp; ASTM Approved Chem
          </span>
        </div>
      </div>
    </section>
  );
}

export function CertificationStrip() {
  return (
    <section id="certifications" className="bg-[#061A35] text-white py-16 lg:py-20 border-t border-[#1B5A86]/40">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block px-3 py-1 rounded-full bg-[#0A2344] border border-[#1B5A86] text-[#00D9FF] text-[11px] font-bold uppercase tracking-widest mb-3">
            TRUSTED MATERIALS &amp; CERTIFICATIONS
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Verified Quality &amp; Industrial Standards</h2>
          <p className="text-[#9FB7CF] text-base sm:text-lg mt-3 leading-relaxed">
            Engineered formulations and application practices rigorously certified to international ASTM, BS, and ISO quality management guidelines.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          {/* Cert 1 */}
          <div className="p-5 rounded-xl bg-[#0A2344] border border-[#1B5A86] flex flex-col items-center text-center shadow-sm hover:border-[#00D9FF] transition-colors">
            <div className="w-12 h-12 rounded bg-[#d32f2f]/20 border border-[#d32f2f]/40 text-[#ff6b6b] font-black flex items-center justify-center text-sm mb-3">
              SIKA
            </div>
            <h3 className="font-bold text-white text-sm mb-1">Sika Authorized Applicator</h3>
            <p className="text-xs text-[#9FB7CF]">SIKA Approved Chemical Partner</p>
            <span className="mt-2.5 text-[10px] font-bold text-[#00D9FF] uppercase tracking-wider">CERTIFIED TIER-1</span>
          </div>

          {/* Cert 2 */}
          <div className="p-5 rounded-xl bg-[#0A2344] border border-[#1B5A86] flex flex-col items-center text-center shadow-sm hover:border-[#00D9FF] transition-colors">
            <div className="w-12 h-12 rounded bg-[#00A8FF]/20 border border-[#00A8FF]/40 text-[#00A8FF] flex items-center justify-center mb-3">
              <ShieldCheck size={24} />
            </div>
            <h3 className="font-bold text-white text-sm mb-1">ISO 9001:2015</h3>
            <p className="text-xs text-[#9FB7CF]">Quality Management System</p>
            <span className="mt-2.5 text-[10px] font-bold text-[#16A34A] uppercase tracking-wider">AUDITED &amp; COMPLIANT</span>
          </div>

          {/* Cert 3 */}
          <div className="p-5 rounded-xl bg-[#0A2344] border border-[#1B5A86] flex flex-col items-center text-center shadow-sm hover:border-[#00D9FF] transition-colors">
            <div className="w-12 h-12 rounded bg-[#f59e0b]/20 border border-[#f59e0b]/40 text-[#f59e0b] flex items-center justify-center mb-3">
              <Check size={24} />
            </div>
            <h3 className="font-bold text-white text-sm mb-1">ASTM C836/C881</h3>
            <p className="text-xs text-[#9FB7CF]">Certified Batch MTC &amp; TDS</p>
            <span className="mt-2.5 text-[10px] font-bold text-[#f59e0b] uppercase tracking-wider">QUALITY TESTED</span>
          </div>

          {/* Cert 4 */}
          <div className="p-5 rounded-xl bg-[#0A2344] border border-[#1B5A86] flex flex-col items-center text-center shadow-sm hover:border-[#00D9FF] transition-colors">
            <div className="w-12 h-12 rounded bg-[#16A34A]/20 border border-[#16A34A]/40 text-[#16A34A] flex items-center justify-center mb-3">
              <ShieldCheck size={24} />
            </div>
            <h3 className="font-bold text-white text-sm mb-1">OSHA Safety</h3>
            <p className="text-xs text-[#9FB7CF]">Site Standard Safety SOPs</p>
            <span className="mt-2.5 text-[10px] font-bold text-[#20C76A] uppercase tracking-wider">ZERO-ACCIDENT CREW</span>
          </div>

          {/* Cert 5 */}
          <div className="p-5 rounded-xl bg-[#0A2344] border border-[#1B5A86] flex flex-col items-center text-center shadow-sm hover:border-[#00D9FF] transition-colors">
            <div className="w-12 h-12 rounded bg-[#00D9FF]/20 border border-[#00D9FF]/40 text-[#00D9FF] flex items-center justify-center mb-3">
              <Layers size={24} />
            </div>
            <h3 className="font-bold text-white text-sm mb-1">Eco-Friendly Potable Safe</h3>
            <p className="text-xs text-[#9FB7CF]">Low-VOC &amp; Non-Toxic Formulations</p>
            <span className="mt-2.5 text-[10px] font-bold text-[#00D9FF] uppercase tracking-wider">POTABLE TANK SAFE</span>
          </div>

          {/* Cert 6 */}
          <div className="p-5 rounded-xl bg-[#0A2344] border border-[#1B5A86] flex flex-col items-center text-center shadow-sm hover:border-[#00D9FF] transition-colors">
            <div className="w-12 h-12 rounded bg-[#00A8FF]/20 border border-[#00A8FF]/40 text-[#00A8FF] flex items-center justify-center mb-3">
              <Users size={24} />
            </div>
            <h3 className="font-bold text-white text-sm mb-1">SECP / PEC</h3>
            <p className="text-xs text-[#9FB7CF]">Registered Corporate Entity</p>
            <span className="mt-2.5 text-[10px] font-bold text-[#00A8FF] uppercase tracking-wider">ACTIVE TAXPAYER</span>
          </div>
        </div>

        <div className="mt-10 text-center text-xs font-medium text-[#7895AE]">
          100% Genuine Chemical Batches • Supplied with Manufacturer Inspection Certificates • British Standards (BS) • ASTM International • Green Building Safe
        </div>
      </div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="crete-site-footer" id="site-footer">
      <div className="crete-footer-shell">
        <div className="crete-footer-main">
          {/* Brand Column */}
          <div className="crete-footer-brand">
            <a href="#home" className="crete-footer-logo" aria-label="CRETE-CHEM home">
              <Image
                src="/assets/crete-chem-logo-enhanced.png"
                alt="CRETE-CHEM Logo"
                width={58}
                height={48}
                className="w-full h-full object-contain"
              />
            </a>
            <div>
              <div className="crete-footer-company">CRETE-CHEM (Pvt.) Ltd.</div>
              <div className="crete-footer-tagline">Authorized Agent of Sika Pakistan</div>
            </div>
            <p>
              Engineered waterproofing and construction chemical solutions for homes, buildings and infrastructure across Pakistan.
            </p>
            <div className="crete-footer-badges">
              <span><b>✓</b> Sika Partner</span>
              <span><b>✓</b> Quality Focused</span>
              <span><b>✓</b> Technical Support</span>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="crete-footer-column">
            <h4>Quick Links</h4>
            <a href="#home">Home</a>
            <a href="#services">Services</a>
            <a href="#products">Products</a>
            <a href="#projects">Projects</a>
            <a href="#contact">Contact Us</a>
          </div>

          {/* Services Column */}
          <div className="crete-footer-column">
            <h4>Services</h4>
            <a href="#services">Roof &amp; Terrace Waterproofing</a>
            <a href="#services">Water Tank Protection</a>
            <a href="#services">Bathroom Seepage</a>
            <a href="#services">Basement Seepage</a>
            <a href="#services">Industrial Flooring</a>
          </div>

          {/* Products Column */}
          <div className="crete-footer-column">
            <h4>Products</h4>
            <a href="#products">Waterproofing Membranes</a>
            <a href="#products">Cementitious Waterproofing</a>
            <a href="#products">Crystalline Sealants</a>
            <a href="#products">Industrial Epoxy Flooring</a>
            <a href="#products">Structural Repair Mortars</a>
          </div>

          {/* Contact Column */}
          <div className="crete-footer-column crete-footer-contact">
            <h4>Contact</h4>
            <a href={`tel:+${contact.whatsapp}`}>
              <span className="text-[#00D9FF]">📞</span>
              <span>{contact.whatsappDisplay}</span>
            </a>
            <a href={`mailto:${contact.email}`}>
              <span className="text-[#00D9FF]">✉</span>
              <span>{contact.email}</span>
            </a>
            <div>
              <span className="text-[#00D9FF]">📍</span>
              <span>Block #9, I&amp;T Center, Street #54,<br />G-9/4, Islamabad, Pakistan.</span>
            </div>
            <div className="crete-footer-socials">
              <span title="Facebook" aria-label="Facebook">
                <Facebook size={17} />
              </span>
              <span title="LinkedIn" aria-label="LinkedIn">
                <Linkedin size={17} />
              </span>
              <span title="Instagram" aria-label="Instagram">
                <Instagram size={17} />
              </span>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="crete-footer-bottom">
          <span>© {new Date().getFullYear()} CRETE-CHEM (Pvt.) Ltd. All rights reserved.</span>
          <div>
            <a href="#contact">Privacy Policy</a>
            <a href="#contact">Terms &amp; Conditions</a>
            <a href="#contact">Technical Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
