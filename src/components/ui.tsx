"use client";
import { useEffect, useRef, useId, type ReactNode } from "react";
import {
  X,
  ArrowUpRight,
  House,
  Droplets,
  Bath,
  Building2,
  Layers,
  Sun,
  ShieldCheck,
} from "lucide-react";
export function Icon({ name, size = 24 }: { name?: string; size?: number }) {
  const icons = {
    roof: House,
    tank: Droplets,
    bath: Bath,
    basement: Building2,
    wall: Layers,
    heat: Sun,
  };
  const Component = icons[name as keyof typeof icons] || ShieldCheck;
  return <Component size={size} aria-hidden="true" />;
}
let openDialogs = 0;
let originalOverflow = "";
export function Modal({
  title,
  children,
  onClose,
  drawer = false,
  maxWidth,
  className,
  hideDefaultHeading = false,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
  drawer?: boolean;
  maxWidth?: string;
  className?: string;
  hideDefaultHeading?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const close = useRef(onClose);
  close.current = onClose;
  const titleId = useId();
  useEffect(() => {
    const d = ref.current!;
    const active = document.activeElement as HTMLElement;
    d.showModal();
    if (openDialogs === 0) originalOverflow = document.body.style.overflow;
    openDialogs++;
    document.body.style.overflow = "hidden";
    return () => {
      openDialogs--;
      if (openDialogs === 0) document.body.style.overflow = originalOverflow;
      d.close();
      if (active?.isConnected) active.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className={drawer ? `dialog drawer ${className || ""}` : `dialog ${className || ""}`}
      style={maxWidth ? { maxWidth } : undefined}
      onCancel={(e) => {
        e.preventDefault();
        close.current();
      }}
      onClick={(e) => {
        if (ref.current) {
          const rect = ref.current.getBoundingClientRect();
          const isInside =
            e.clientX >= rect.left &&
            e.clientX <= rect.right &&
            e.clientY >= rect.top &&
            e.clientY <= rect.bottom;
          if (!isInside) {
            close.current();
          }
        }
      }}
      aria-labelledby={titleId}
    >
      <div className="dialog-inner">
        {!hideDefaultHeading && (
          <div className="dialog-heading">
            <div>
              <p className="eyebrow">CRETE-CHEM</p>
              <h2 id={titleId}>{title}</h2>
            </div>
            <button
              type="button"
              className="icon-button"
              aria-label="Close dialog"
              onClick={onClose}
            >
              <X />
            </button>
          </div>
        )}
        {children}
      </div>
    </dialog>
  );
}
export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="section-heading">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      {description && <p>{description}</p>}
    </div>
  );
}
export function ExternalArrow() {
  return <ArrowUpRight size={18} aria-hidden="true" />;
}
