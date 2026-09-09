"use client";
import { useState } from "react";
import { Play, ArrowUpRight } from "lucide-react";
import { Modal, SectionHeading } from "./ui";
const videos = [
  {
    id: "AITNi9kPGig",
    title: "Liquid-applied roof waterproofing",
    copy: "Manufacturer application demonstration",
  },
  {
    id: "uYaXsHqQzBo",
    title: "Waterproofing for new and old roofs",
    copy: "Roof and detail application overview",
  },
];
export function Resources() {
  const [video, setVideo] = useState<(typeof videos)[number] | null>(null);
  return (
    <section id="resources" className="section">
      <div className="container">
        <SectionHeading
          eyebrow="Application guidance"
          title="See how professional systems are applied"
          description="Application quality matters as much as material selection. These manufacturer-published demonstrations introduce key steps; project conditions still require technical assessment."
        />
        <div className="video-grid">
          {videos.map((v, i) => (
            <button
              className="video-card"
              key={v.id}
              onClick={() => setVideo(v)}
            >
              <div className={`video-poster video-${i}`}>
                <span>
                  <Play fill="currentColor" size={24} />
                </span>
              </div>
              <div>
                <h3>{v.title}</h3>
                <p>{v.copy}</p>
              </div>
            </button>
          ))}
        </div>
        <div className="faq-layout">
          <div>
            <p className="eyebrow">Technical FAQs</p>
            <h2>
              Questions before
              <br />
              you begin
            </h2>
            <p>
              Clear starting points for a productive technical conversation.
            </p>
            <a className="text-link" href="#contact">
              Ask our team <ArrowUpRight size={17} />
            </a>
          </div>
          <div className="accordion">
            {[
              [
                "Do you recommend a product before inspection?",
                "Some problems can be discussed from photos and history, but site condition, substrate and water path may require inspection before a system is recommended.",
              ],
              [
                "Can an existing waterproofing system be repaired?",
                "It depends on adhesion, compatibility, moisture condition and how widely the existing system has failed. The condition should be assessed first.",
              ],
              [
                "What information should I share on WhatsApp?",
                "Share the affected area, when leakage appears, approximate size, previous treatments and clear photos. Avoid sharing private documents or unrelated personal data.",
              ],
              [
                "Are application videos a substitute for site guidance?",
                "No. Videos are useful introductions. Actual surface preparation, consumption, detailing and curing must follow the selected system and site conditions.",
              ],
            ].map(([q, a]) => (
              <details key={q}>
                <summary>
                  {q}
                  <span>+</span>
                </summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
      {video && (
        <Modal title={video.title} onClose={() => setVideo(null)}>
          <iframe
            className="video-frame"
            src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1`}
            title={video.title}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
          <p>
            Manufacturer application demonstration. Follow the selected product
            specification and site guidance.
          </p>
        </Modal>
      )}
    </section>
  );
}
