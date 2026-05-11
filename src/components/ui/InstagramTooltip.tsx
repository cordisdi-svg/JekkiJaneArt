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
      // На тач-устройствах не реагируем на hover
      if (document.documentElement.classList.contains("is-touch")) return;
      
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
        
        requestAnimationFrame(() => {
          const rect = el!.getBoundingClientRect();
          setPos({
            x: rect.left + rect.width / 2,
            y: rect.top - 8
          });
          setVisible(true);
        });
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      if (document.documentElement.classList.contains("is-touch")) return;
      
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

    const handleClickCapture = (e: MouseEvent) => {
      // Перехватываем клик только на тач-устройствах
      if (!document.documentElement.classList.contains("is-touch")) {
        setVisible(false);
        return;
      }

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
        // Блокируем стандартный переход
        e.preventDefault();
        e.stopPropagation();

        const rect = el.getBoundingClientRect();
        setPos({
          x: rect.left + rect.width / 2,
          y: rect.top - 8
        });
        setVisible(true);
        
        clearTimeout(timeoutId);
        // Запускаем переход через 1 секунду
        timeoutId = setTimeout(() => {
          window.open(el!.href, '_blank');
        }, 1000);
      } else {
        setVisible(false);
      }
    };

    document.addEventListener("mouseover", handleMouseOver, { passive: true });
    document.addEventListener("mouseout", handleMouseOut, { passive: true });
    document.addEventListener("click", handleClickCapture, { capture: true });
    document.addEventListener("touchstart", () => {
      // We don't hide on touchstart anymore because we want to intercept click
    }, { passive: true });

    return () => {
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
      document.removeEventListener("click", handleClickCapture, { capture: true });
      clearTimeout(timeoutId);
    };
  }, []);

  if (!visible) return null;

  // Calculate dynamic position to prevent screen overflow
  // On mobile, tooltips can easily go off-screen.
  const margin = 12;
  const tooltipWidth = 230; // Уменьшенная ширина для 2-х строк
  const windowWidth = typeof window !== "undefined" ? window.innerWidth : 1000;
  
  // Clamp left position
  const halfWidth = tooltipWidth / 2;
  const leftPos = Math.max(margin + halfWidth, Math.min(windowWidth - margin - halfWidth, pos.x));
  
  // Calculate arrow offset if we clamped the position
  const arrowOffset = pos.x - leftPos;

  return (
    <div
      ref={tooltipRef}
      className="fixed z-[99999] pointer-events-none px-3 py-1.5 bg-[#4A4A4A]/90 backdrop-blur-sm border border-white/10 text-white font-light text-[11px] rounded-lg shadow-xl tracking-wide transition-opacity duration-200 flex items-center justify-center"
      style={{ 
        left: leftPos, 
        top: pos.y, 
        width: tooltipWidth,
        transform: 'translate(-50%, -100%)',
        fontFamily: "Comfortaa, sans-serif" 
      }}
    >
      <div className="text-center leading-tight">
        Организация признана экстремистской<br/>и запрещена на территории РФ
      </div>
      {/* Arrow pointing down - adjusted to always point at the icon */}
      <div 
        className="absolute top-full left-1/2 border-[5px] border-transparent border-t-[#4A4A4A]/90" 
        style={{ transform: `translateX(calc(-50% + ${arrowOffset}px))` }}
      />
    </div>
  );
}
