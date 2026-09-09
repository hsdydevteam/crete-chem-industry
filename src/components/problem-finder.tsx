"use client";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { useStore } from "./store-provider";
import { Icon, Modal } from "./ui";
import { ProductCard } from "./products";
export function ProblemFinder() {
  const { catalog, inspect } = useStore();
  const [selected, setSelected] = useState(""),
    [open, setOpen] = useState(false);
  const service =
    catalog.services.find((s) => s.id === selected) || catalog.services[0];
  if (!service) return null;
  return (
    <section id="problem-finder" className="problem-finder">
      <div className="container">
        <div>
          <p className="eyebrow">Start with the problem</p>
          <h2>Find your leakage problem</h2>
          <p>Choose the affected area for a practical starting point.</p>
        </div>
        <div className="problem-options">
          {catalog.services.map((s) => (
            <button
              key={s.id}
              className={service.id === s.id ? "chip selected" : "chip"}
              onClick={() => setSelected(s.id)}
              aria-pressed={service.id === s.id}
            >
              <Icon name={s.icon} size={17} />
              {s.title}
            </button>
          ))}
        </div>
        <div className="finder-result">
          <div>
            <strong>{service.title}</strong>
            <p>{service.description}</p>
          </div>
          <button className="button secondary" onClick={() => setOpen(true)}>
            Discuss this problem <ArrowUpRight size={18} />
          </button>
        </div>
      </div>
      {open && (
        <Modal title={service.title} onClose={() => setOpen(false)} drawer>
          <p>
            Tell us where water appears, when the issue is visible and what has
            been tried before.
          </p>
          <p className="advice-note">
            Final system selection depends on the substrate and site assessment.
          </p>
          <div className="recommendations">
            {catalog.products
              .filter((p) => service.recommendedProductIds.includes(p.id))
              .map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
          </div>
          <button
            className="button primary w-full"
            onClick={() => {
              setOpen(false);
              inspect(service.id);
            }}
          >
            Request free inspection <ArrowUpRight size={18} />
          </button>
        </Modal>
      )}
    </section>
  );
}
