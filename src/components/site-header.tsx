"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, ArrowUpRight, MapPin, Mail, Clock } from "lucide-react";
import { contact } from "@/lib/seed";
import { useStore } from "./store-provider";

export function Brand() {
  return (
    <Link className="brand-lockup" href="/#home" aria-label="CRETE-CHEM home">
      <span className="brand-mark">
        <Image
          src="/assets/crete-chem-logo-enhanced.png"
          alt="CRETE-CHEM logo"
          width={58}
          height={48}
          priority
          className="w-full h-full object-contain"
        />
      </span>
      <span className="brand-copy">
        <strong>
          CRETE-CHEM <small>(Pvt.) Ltd.</small>
        </strong>
        <small>Authorized Agent of Sika Pakistan</small>
      </span>
    </Link>
  );
}

export function SiteHeader() {
  const { cart, openCart, catalog } = useStore();
  const [menu, setMenu] = useState(false);
  const [active, setActive] = useState("home");

  const links: [string, string, string][] = [
    ["Home", "home", "home"],
    ["Services", "services", "services-catalog"],
    ["Products", "products", "products-catalog"],
    ["Projects", "projects", "projects"],
    ["Resources", "resources", "resources"],
    ["About Us", "about", "about"],
    ["Contact Us", "contact", "request-inspection"],
  ];

  const totalItems = cart.reduce((n, i) => n + i.quantity, 0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setActive(e.target.id);
          }
        }
      },
      { rootMargin: "-15% 0px -65% 0px" },
    );

    for (const [, id, altId] of links) {
      const e = document.getElementById(id) || document.getElementById(altId);
      if (e) observer.observe(e);
    }
    return () => observer.disconnect();
  }, [links]);

  const handleNavClick = (id: string, altId: string, e: React.MouseEvent) => {
    setMenu(false);
    const el = document.getElementById(id) || document.getElementById(altId);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth" });
      window.history.pushState(null, "", `#${id}`);
      setActive(id);
    }
  };

  return (
    <>
      <div className="crete-topbar">
        <div className="crete-container topbar-inner">
          <div className="topbar-left">
            <span>
              <MapPin size={13} className="topbar-icon" /> Head Office: Islamabad, Pakistan
            </span>
            <span className="topbar-sep">|</span>
            <a href={`mailto:${contact.email}`}>
              <Mail size={13} className="topbar-icon" /> {contact.email}
            </a>
            <span className="topbar-sep">|</span>
            <span>
              <Clock size={13} className="topbar-icon" /> Mon - Sat: 9:00 AM - 6:00 PM
            </span>
          </div>
          <div className="topbar-right">
            <div className="social-links" aria-label="Social links">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                f
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                in
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
              >
                ▶
              </a>
            </div>
            <span className="trusted-line">Trusted by Professionals Across Pakistan</span>
          </div>
        </div>
      </div>

      <header className="crete-header">
        <div className="crete-container nav-inner">
          <Brand />

          <nav aria-label="Primary navigation" className="desktop-nav">
            {links.map(([label, id, altId]) => (
              <a
                key={id}
                href={`/#${id}`}
                className={active === id || active === altId ? "active" : ""}
                onClick={(e) => handleNavClick(id, altId, e)}
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="nav-actions">
            <button
              className="cart-button"
              onClick={openCart}
              aria-label={`Open cart, ${totalItems} items`}
              type="button"
            >
              <ShoppingBag size={18} />
              <span className="cart-word">Cart</span>
              <b>{totalItems}</b>
            </button>

            <a
              className="quote-btn"
              href="#contact"
              onClick={(e) => handleNavClick("contact", "request-inspection", e)}
            >
              Get a Quote <span>→</span>
            </a>
          </div>

          <div className="mobile-header-actions">
            <button
              className="mobile-cart-btn"
              onClick={openCart}
              aria-label={`Open cart, ${totalItems} items`}
              type="button"
            >
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <span className="mobile-cart-badge">{totalItems}</span>
              )}
            </button>

            <button
              aria-expanded={menu}
              aria-label={menu ? "Close menu" : "Open menu"}
              className={`mobile-menu-btn ${menu ? "open" : ""}`}
              onClick={() => setMenu(!menu)}
              type="button"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>

        <div className={`mobile-nav ${menu ? "open" : ""}`} id="creteMobileNav">
          {links.map(([label, id, altId]) => (
            <a
              key={id}
              href={`/#${id}`}
              className={active === id || active === altId ? "active" : ""}
              onClick={(e) => handleNavClick(id, altId, e)}
            >
              {label}
            </a>
          ))}
          <button
            className="mobile-nav-cart-btn"
            onClick={() => {
              setMenu(false);
              openCart();
            }}
            type="button"
          >
            <ShoppingBag size={18} />
            <span>View Cart</span>
            <b>{totalItems}</b>
          </button>
          <a
            className="mobile-quote"
            href="#contact"
            onClick={(e) => handleNavClick("contact", "request-inspection", e)}
          >
            Get a Quote →
          </a>
        </div>
      </header>

      {catalog?.banners
        ?.filter((b) => b.active)
        ?.map((b) => (
          <div className="announcement" key={b.id}>
            <a href={b.link}>
              <strong>{b.title}</strong>
              <span>{b.description}</span>
              <ArrowUpRight size={16} />
            </a>
          </div>
        ))}
    </>
  );
}

