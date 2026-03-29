"use client";

import { useEffect, useState } from "react";

export function InstagramTooltip() {
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      let isInstagram = false;
      let el = target.closest("a") as HTMLAnchorElement | null;
      if (el && el.href && el.href.toLowerCase().includes("instagram.com")) {
        isInstagram = true;
      }

      if (!isInstagram && target.tagName === "IMG") {
        const img = target as HTMLImageElement;
        if (img.src && img.src.toLowerCase().includes("instagram")) {
          isInstagram = true;
          el = target.closest('a') as HTMLAnchorElement | null;
        }
      }

      if (isInstagram && el) {
        clearTimeout(timeoutId);
        
        const rect = el.getBoundingClientRect();
        setPos({
          x: rect.left + rect.width / 2,
          y: rect.top - 8
        });
        setVisible(true);
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      let isInstagram = false;
      let el = target.closest("a") as HTMLAnchorElement | null;
      if (el && el.href && el.href.toLowerCase().includes("instagram.com")) {
        isInstagram = true;
      }

      if (!isInstagram && target.tagName === "IMG") {
        const img = target as HTMLImageElement;
        if (img.src && img.src.toLowerCase().includes("instagram")) {
          isInstagram = true;
        }
      }
      
      if (isInstagram) {
        timeoutId = setTimeout(() => {
          setVisible(false);
        }, 50);
      }
    };

    document.addEventListener("mouseover", handleMouseOver, { passive: true });
    document.addEventListener("mouseout", handleMouseOut, { passive: true });

    return () => {
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
      clearTimeout(timeoutId);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed z-[99999] pointer-events-none px-3 py-1.5 bg-[#4A4A4A]/90 backdrop-blur-sm border border-white/10 text-white font-light text-[11px] whitespace-nowrap rounded-lg shadow-xl tracking-wide transform -translate-x-1/2 -translate-y-full transition-opacity duration-200"
      style={{ left: pos.x, top: pos.y, fontFamily: "Comfortaa, sans-serif" }}
    >
      Организация признана экстремистской и запрещена на территории РФ
      {/* Arrow pointing down */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-[#4A4A4A]/90" />
    </div>
  );
}
