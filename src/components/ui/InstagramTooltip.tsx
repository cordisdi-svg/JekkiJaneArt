"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { useModal } from "@/components/modals/ModalProvider";

export function InstagramTooltip() {
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const pathname = usePathname();
  const { activeModal } = useModal();
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Hide on page change or modal open/close
  useEffect(() => {
    setVisible(false);
  }, [pathname, activeModal]);

  // Auto-hide after 3 seconds
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        setVisible(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [visible]);

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
      const el = target.closest("a") as HTMLAnchorElement | null;
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

    const handleClick = () => {
      setVisible(false);
    };

    document.addEventListener("mouseover", handleMouseOver, { passive: true });
    document.addEventListener("mouseout", handleMouseOut, { passive: true });
    document.addEventListener("click", handleClick, { passive: true });
    document.addEventListener("touchstart", handleClick, { passive: true });

    return () => {
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
      document.removeEventListener("click", handleClick);
      document.removeEventListener("touchstart", handleClick);
      clearTimeout(timeoutId);
    };
  }, []);

  if (!visible) return null;

  // Calculate dynamic position to prevent screen overflow
  // On mobile, tooltips can easily go off-screen.
  const margin = 12;
  const tooltipWidth = 280; // Approximate width or we could use tooltipRef
  const windowWidth = typeof window !== "undefined" ? window.innerWidth : 1000;
  
  // Clamp left position
  const halfWidth = tooltipWidth / 2;
  const leftPos = Math.max(margin + halfWidth, Math.min(windowWidth - margin - halfWidth, pos.x));
  
  // Calculate arrow offset if we clamped the position
  const arrowOffset = pos.x - leftPos;

  return (
    <div
      ref={tooltipRef}
      className="fixed z-[99999] pointer-events-none px-3 py-1.5 bg-[#4A4A4A]/90 backdrop-blur-sm border border-white/10 text-white font-light text-[11px] whitespace-normal sm:whitespace-nowrap rounded-lg shadow-xl tracking-wide transition-opacity duration-200"
      style={{ 
        left: leftPos, 
        top: pos.y, 
        width: tooltipWidth,
        transform: 'translate(-50%, -100%)',
        fontFamily: "Comfortaa, sans-serif" 
      }}
    >
      <div className="text-center">
        Организация признана экстремистской и запрещена на территории РФ
      </div>
      {/* Arrow pointing down - adjusted to always point at the icon */}
      <div 
        className="absolute top-full left-1/2 border-[5px] border-transparent border-t-[#4A4A4A]/90" 
        style={{ transform: `translateX(calc(-50% + ${arrowOffset}px))` }}
      />
    </div>
  );
}
