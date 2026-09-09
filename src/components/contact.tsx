"use client";

import { useState, useEffect, useRef, type FormEvent } from "react";
import {
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  CheckCircle2,
  Send,
  Clock,
  Building2,
  ShieldCheck,
} from "lucide-react";
import { contact } from "@/lib/seed";
import { api } from "@/lib/client";
import { useStore } from "./store-provider";

export function ContactSection() {
  const { catalog, inspection } = useStore();
  const [serviceId, setService] = useState(inspection);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ id: string; whatsappUrl: string } | null>(null);
  const requestId = useRef("");

  useEffect(() => {
    setService(inspection);
  }, [inspection]);

  useEffect(() => {
    const id = new URLSearchParams(location.search).get("service");
    if (id) setService(id);
    const listener = (event: Event) =>
      setService((event as CustomEvent<string>).detail);
    window.addEventListener("crete:inspect", listener);
    return () => window.removeEventListener("crete:inspect", listener);
  }, []);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    requestId.current ||= crypto.randomUUID();
    setBusy(true);
    setError("");
    try {
      setResult(
        await api("inquiries", "POST", {
          ...data,
          serviceId,
          requestId: requestId.current,
        })
      );
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  const phone = contact.whatsapp || "923008548956";
  const defaultWaUrl = `https://wa.me/${phone}?text=${encodeURIComponent(
    "Hello CRETE-CHEM, I would like to discuss a waterproofing or construction chemical requirement for my project."
  )}`;

  return (
    <section
      id="contact"
      className="w-full py-16 lg:py-20 bg-[#061A35] text-white border-t border-[#1B5A86]/40"
    >
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block px-3 py-1 rounded-full bg-[#0A2344] border border-[#1B5A86] text-[#00D9FF] text-[11px] font-bold uppercase tracking-widest mb-3">
            GET IN TOUCH
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Contact Us
          </h2>
          <p className="text-[#9FB7CF] text-base sm:text-lg mt-3 leading-relaxed">
            Ready to protect your property? Reach out for a free consultation or on-site moisture diagnosis anywhere in Pakistan.
          </p>
        </div>

        {/* Two-Column Desktop Layout (stacks naturally on mobile) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-12">
          {/* LEFT: Contact Information (5 columns) */}
          <div className="lg:col-span-5 bg-[#0A2344] border border-[#1B5A86] rounded-xl p-6 sm:p-8 flex flex-col justify-between shadow-lg">
            <div>
              {/* Header Badges */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="px-2.5 py-1 rounded bg-[#f97316]/20 border border-[#f97316]/40 text-[#fb923c] text-[10px] font-bold tracking-wider uppercase">
                  FAST RESPONSE
                </span>
                <span className="flex items-center gap-1.5 text-xs font-semibold text-[#20C76A]">
                  <span className="w-2 h-2 rounded-full bg-[#20C76A] inline-block animate-ping"></span>
                  Live Technical Desk
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                Contact Information
              </h3>
              <p className="text-[#9FB7CF] text-sm leading-relaxed mb-6">
                Speak directly with certified civil engineers and waterproofing specialists for commercial, industrial, or residential projects nationwide.
              </p>

              <div className="space-y-4 text-sm">
                {/* Direct Phone */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-lg bg-[#061A35] border border-[#1B5A86] flex items-center justify-center text-[#00D9FF] shrink-0">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="text-[#7895AE] text-xs font-semibold uppercase tracking-wider">Direct Phone Inquiry</p>
                    <a
                      className="text-white font-bold hover:text-[#00D9FF] transition-colors text-base"
                      href={`tel:+${contact.whatsapp}`}
                    >
                      {contact.whatsappDisplay}
                    </a>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-lg bg-[#061A35] border border-[#1B5A86] flex items-center justify-center text-[#20C76A] shrink-0">
                    <MessageCircle size={18} />
                  </div>
                  <div>
                    <p className="text-[#7895AE] text-xs font-semibold uppercase tracking-wider">WhatsApp Technical Desk</p>
                    <a
                      className="text-white font-bold hover:text-[#20C76A] transition-colors text-base flex items-center gap-1.5"
                      href={defaultWaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span>WhatsApp CRETE-CHEM</span>
                    </a>
                  </div>
                </div>

                {/* Official Corporate Email */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-lg bg-[#061A35] border border-[#1B5A86] flex items-center justify-center text-[#00D9FF] shrink-0">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="text-[#7895AE] text-xs font-semibold uppercase tracking-wider">Official Corporate Email</p>
                    <a
                      className="text-white font-semibold hover:text-[#00D9FF] transition-colors text-sm"
                      href={`mailto:${contact.email}`}
                    >
                      {contact.email}
                    </a>
                  </div>
                </div>

                {/* Headquarters */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-lg bg-[#061A35] border border-[#1B5A86] flex items-center justify-center text-[#00D9FF] shrink-0">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="text-[#7895AE] text-xs font-semibold uppercase tracking-wider">Headquarters</p>
                    <p className="text-white font-medium text-sm leading-snug">
                      Office # 01 &amp; 02, Block 9, I&amp;T Center, G-9/4, Islamabad
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Working Hours */}
            <div className="pt-6 mt-6 border-t border-[#1B5A86]/60">
              <div className="flex items-center gap-2 text-white font-semibold text-sm mb-2">
                <Clock size={16} className="text-[#00D9FF]" />
                <span>Working Hours</span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm text-[#9FB7CF]">
                <span>Monday – Saturday:</span>
                <span className="text-white font-medium">9:00 AM – 6:00 PM</span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm text-[#9FB7CF] mt-1">
                <span>Sunday:</span>
                <span className="text-[#fb923c] font-semibold">Emergency On-Call Active</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Request Free Inspection form (7 columns) */}
          <div
            id="request-inspection"
            className="lg:col-span-7 bg-[#0A2344] border border-[#1B5A86] rounded-xl p-6 sm:p-8 flex flex-col justify-between shadow-lg"
          >
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-1.5">
                Request Free Inspection
              </h3>
              <p className="text-[#9FB7CF] text-sm leading-relaxed mb-6">
                Fill out the form below and an engineer will contact you within 24 hours to schedule moisture diagnostics.
              </p>

              {result ? (
                <div className="bg-[#061A35] border border-[#1B5A86] rounded-xl p-6 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-[#16A34A]/20 border border-[#16A34A] text-[#20C76A] mx-auto flex items-center justify-center">
                    <CheckCircle2 size={32} />
                  </div>
                  <h4 className="text-xl font-bold text-white">
                    Inspection Request Received!
                  </h4>
                  <p className="text-[#9FB7CF] text-sm max-w-md mx-auto">
                    A certified CRETE-CHEM engineer will review your project details and contact you shortly.
                  </p>
                  <p className="text-xs font-mono text-[#00D9FF] bg-[#0A2344] py-1 px-3 rounded inline-block">
                    Reference ID: {result.id}
                  </p>
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a
                      className="inline-flex items-center justify-center gap-2 bg-[#16A34A] hover:bg-[#20C76A] text-white font-bold text-sm py-2.5 px-5 rounded-lg transition-colors"
                      href={result.whatsappUrl || defaultWaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle size={18} />
                      <span>Continue on WhatsApp</span>
                    </a>
                    <button
                      type="button"
                      className="text-xs text-[#9FB7CF] hover:text-white underline py-2"
                      onClick={() => {
                        setResult(null);
                        requestId.current = "";
                      }}
                    >
                      Submit another inquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form className="space-y-4" onSubmit={submit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1.5">
                        Full Name <span className="text-[#f97316]">*</span>
                      </label>
                      <input
                        className="w-full bg-[#061A35] border border-[#1B5A86] rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-[#7895AE] focus:outline-none focus:border-[#00D9FF]"
                        placeholder="e.g. Engr. Tariq Mehmood"
                        name="name"
                        required
                        maxLength={100}
                        autoComplete="name"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1.5">
                        Phone / WhatsApp <span className="text-[#f97316]">*</span>
                      </label>
                      <input
                        className="w-full bg-[#061A35] border border-[#1B5A86] rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-[#7895AE] focus:outline-none focus:border-[#00D9FF]"
                        placeholder="+92 3XX XXXXXXX"
                        name="phone"
                        type="tel"
                        required
                        minLength={7}
                        maxLength={25}
                        autoComplete="tel"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1.5">
                        Email Address <span className="text-[#7895AE] font-normal lowercase">(optional)</span>
                      </label>
                      <input
                        className="w-full bg-[#061A35] border border-[#1B5A86] rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-[#7895AE] focus:outline-none focus:border-[#00D9FF]"
                        placeholder="client@company.com"
                        name="email"
                        type="email"
                        autoComplete="email"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1.5">
                        City / Location <span className="text-[#f97316]">*</span>
                      </label>
                      <input
                        className="w-full bg-[#061A35] border border-[#1B5A86] rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-[#7895AE] focus:outline-none focus:border-[#00D9FF]"
                        placeholder="Islamabad, Rawalpindi, Lahore..."
                        name="location"
                        required
                        maxLength={200}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1.5">
                      Required Service <span className="text-[#f97316]">*</span>
                    </label>
                    <select
                      className="w-full bg-[#061A35] border border-[#1B5A86] rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#00D9FF]"
                      value={serviceId}
                      onChange={(e) => setService(e.target.value)}
                      required
                    >
                      <option value="">Select service or chemical requirement</option>
                      {catalog.services.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1.5">
                      Problem Description or Project Scope
                    </label>
                    <textarea
                      className="w-full bg-[#061A35] border border-[#1B5A86] rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-[#7895AE] focus:outline-none focus:border-[#00D9FF]"
                      placeholder="Describe square footage, visible cracks, water seepage severity, site address..."
                      name="description"
                      rows={3}
                      maxLength={1600}
                    ></textarea>
                  </div>

                  {error && (
                    <p className="text-xs text-[#ff6b6b] bg-[#ff6b6b]/10 border border-[#ff6b6b]/30 p-2.5 rounded-lg" role="alert">
                      {error}
                    </p>
                  )}

                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                    <button
                      className="w-full sm:flex-1 bg-[#f97316] hover:bg-[#ea580c] text-white font-bold text-sm py-3 px-6 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                      type="submit"
                      disabled={busy}
                    >
                      <Send size={18} />
                      <span>{busy ? "Submitting..." : "Request Free Inspection"}</span>
                    </button>
                    <a
                      className="w-full sm:w-auto bg-[#16A34A] hover:bg-[#20C76A] text-white font-bold text-sm py-3 px-5 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
                      href={defaultWaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle size={18} />
                      <span>WhatsApp CRETE-CHEM</span>
                    </a>
                  </div>
                </form>
              )}
            </div>

            <p className="text-xs text-[#7895AE] text-center sm:text-left mt-4 border-t border-[#1B5A86]/40 pt-3">
              Your details are protected. No spam. Free diagnostic quotation provided before any work starts.
            </p>
          </div>
        </div>

        {/* Architectural Location Map Widget */}
        <div className="w-full rounded-xl overflow-hidden border border-[#1B5A86] bg-[#0A2344] shadow-lg">
          <div className="p-4 bg-[#08203E] flex flex-wrap items-center justify-between gap-2 border-b border-[#1B5A86]">
            <div className="flex items-center gap-2 text-white">
              <MapPin size={20} className="text-[#f97316]" />
              <span className="font-bold text-sm sm:text-base">
                CRETE-CHEM Islamabad Operations Base
              </span>
            </div>
            <span className="text-xs font-medium text-[#9FB7CF]">
              Sector H-13, Srinagar Highway Corridor, Islamabad
            </span>
          </div>

          <div
            className="w-full h-72 sm:h-80 bg-cover bg-center relative"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBA2YnpOccgcEn2b2Tn4Y9gtOaXjS5voJDrdZQdpei6_T60aXUud2VShVmdurIZ61MP6pklqFovns1gLYYsjLFXt7p2nLRU9amH5JD1a0buTGygjL_x22gODff0X0Lgohvul0zEC9Kgep-C1DEApNecuJ4NIkuK-A8B6t10wDNd0VTWwe_tg7yIni9aXtgub10ryMisiYdAUMAMBXlzeeq09mHYcasHcBbNWPUcWvnu7cFvt2L0TGvFRw')",
            }}
          >
            {/* Dark overlay badge */}
            <div className="absolute bottom-4 left-4 right-4 sm:right-auto bg-[#061A35]/95 text-white backdrop-blur-md p-4 rounded-lg border border-[#1B5A86] shadow-xl max-w-md">
              <p className="text-sm font-bold flex items-center gap-2 text-[#00D9FF]">
                <Building2 size={16} />
                <span>CRETE-CHEM Headquarters</span>
              </p>
              <p className="text-xs text-[#9FB7CF] mt-1.5 leading-snug">
                Office # 01 &amp; 02, Block 9, I&amp;T Center, G-9/4, Islamabad
              </p>
              <p className="text-xs font-semibold text-[#20C76A] mt-1.5 flex items-center gap-1.5">
                <ShieldCheck size={14} />
                <span>Rapid Dispatch to Rawalpindi &amp; Federal Capital • Regional Teams in Lahore &amp; Karachi</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
