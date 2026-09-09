"use client";
import { useEffect, useState } from "react";

export function HeroTypingText({ text = "Leak-Free Living." }: { text?: string }) {
  const [charCount, setCharCount] = useState(text.length);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Respect user accessibility preference for reduced motion
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setCharCount(text.length);
      return;
    }

    // Start typing reveal smoothly with zero layout shift
    setCharCount(0);
    let i = 0;
    // Step interval calibrated to complete in ~450ms (well within 150-600ms requirement)
    const stepTime = Math.max(22, Math.floor(450 / text.length));
    const timer = setInterval(() => {
      i++;
      setCharCount(i);
      if (i >= text.length) {
        clearInterval(timer);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [text]);

  const visiblePart = isClient ? text.slice(0, charCount) : text;
  const hiddenPart = isClient ? text.slice(charCount) : "";

  return (
    <span
      id="heroTypeText"
      className="hero-cyan-text hero-type-container"
      aria-label={text}
      style={{
        display: "inline",
        lineHeight: "inherit",
      }}
    >
      <span>{visiblePart}</span>
      <span className="caret" aria-hidden="true">
        |
      </span>
      {hiddenPart && (
        <span
          style={{
            visibility: "hidden",
            pointerEvents: "none",
            userSelect: "none",
          }}
          aria-hidden="true"
        >
          {hiddenPart}
        </span>
      )}
    </span>
  );
}

