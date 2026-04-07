"use client";

import { useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { orderedRoutes } from "@/data/routes";
import { useModal } from "@/components/modals/ModalProvider";

function Triangle({ direction, className = "" }: { direction: "left" | "right"; className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={`h-6 w-6 fill-white ${className}`} aria-hidden>
      {direction === "left" ? <path d="M13 3 5 10l8 7V3Z" /> : <path d="M7 3v14l8-7-8-7Z" />}
    </svg>
  );
}

function navCellClass(isActive: boolean) {
  return `h-full w-full border-l border-white/20 text-white/95 transition-colors lg:hover:bg-white/10 active:bg-white/15 ${isActive ? "bg-white/15" : ""
    }`;
}

export function BottomNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const isMobileHome = pathname === '/';
  const { openModal } = useModal();

  const [reviewsStatus, setReviewsStatus] = useState<"default" | "underDev">("default");

  const navRoutes = orderedRoutes.filter(r => r.path !== "/reviews");

  const handleReviewsClick = () => {
    setReviewsStatus("underDev");
    setTimeout(() => {
      setReviewsStatus("default");
    }, 3000);
  };

  const currentIndex = navRoutes.findIndex((route) => route.path === pathname);
  const handlePrev = () => {
    const safeIndex = currentIndex >= 0 ? currentIndex : 0;
    router.push(navRoutes[(safeIndex - 1 + navRoutes.length) % navRoutes.length].path);
  };
  const handleNext = () => {
    const safeIndex = currentIndex >= 0 ? currentIndex : 0;
    router.push(navRoutes[(safeIndex + 1) % navRoutes.length].path);
  };

  // Mobile Swipe Logic
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    touchStartX.current = null;
    touchStartY.current = null;

    // Threshold 40px, horizontal must dominate
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      if (dx > 0) handlePrev();
      else handleNext();
    }
  };

  return (
    <nav
      className="fixed bottom-0 left-0 z-[100] w-full pointer-events-auto"
      onPointerDown={(e) => e.stopPropagation()}
      onPointerUp={(e) => e.stopPropagation()}
      onPointerMove={(e) => e.stopPropagation()}
      onPointerCancel={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
      onTouchEnd={(e) => e.stopPropagation()}
      onTouchCancel={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onMouseMove={(e) => e.stopPropagation()}
      onMouseUp={(e) => e.stopPropagation()}
      onWheel={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      style={{
        background: "rgba(0, 0, 0, 0.15)", // Matching walls page bg-black/15
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderTop: "1px solid rgba(255,255,255,0.12)",
        fontFamily: "Fontatica4F",
        fontWeight: 700,
        letterSpacing: "0.02em",
      }}
      aria-label="Bottom navigation"
    >
      <div className="hidden h-[var(--nav-height-desktop)] w-full lg:flex">
        <button type="button" className="flex h-full w-[5%] items-center justify-center border-r border-white/20" onClick={handlePrev} aria-label="Предыдущая страница">
          <Triangle direction="left" className="arrow-anim-left" />
        </button>
        <button type="button" className={`${navCellClass(false)} w-[16.25%] text-[clamp(16px,2.1vw,30px)] leading-none px-1`} onClick={() => router.push("/")}>На главную</button>
        <button type="button" className={`${navCellClass(false)} w-[16.25%] text-[clamp(16px,2.1vw,30px)] leading-none px-1`} onClick={() => openModal("siteCreator")}>Нужен сайт?</button>
        <button type="button" className={`relative overflow-hidden ${navCellClass(false)} w-[25%] text-[clamp(18.5px,2.5vw,36px)] leading-none px-1`} onClick={() => openModal("order")}>
          <div className="btn-shine-layer" />
          <span className="relative z-10">Заказать</span>
        </button>
        <button type="button" className={`${navCellClass(false)} w-[16.25%] text-[clamp(16px,2.1vw,30px)] leading-none px-1`} onClick={handleReviewsClick}>
          {reviewsStatus === "underDev" ? "В разработке" : "Отзывы"}
        </button>
        <button type="button" className={`${navCellClass(false)} w-[16.25%] border-r border-white/20 text-[clamp(15px,1.9vw,26px)] leading-none px-1`} onClick={() => openModal("certificates")}>Сертификаты</button>
        <button type="button" className="flex h-full w-[5%] items-center justify-center" onClick={handleNext} aria-label="Следующая страница">
          <Triangle direction="right" className="arrow-anim-right" />
        </button>
      </div>

      {!isMobileHome && (
        <div
          className="relative flex h-[var(--nav-height-mobile)] w-full flex-col lg:hidden"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* Swipe Indicators Overlay */}
          <div className="pointer-events-none absolute inset-y-0 left-0 right-0 z-10 flex items-center justify-between px-0 opacity-70">
            <div className="scale-75">
              <Triangle direction="left" className="arrow-anim-left" />
            </div>
            <div className="scale-75">
              <Triangle direction="right" className="arrow-anim-right" />
            </div>
          </div>

          <div className="grid h-1/2 grid-cols-2">
            <button type="button" className={`relative overflow-hidden ${navCellClass(false)} border-t border-white/20 text-[clamp(23px,7vw,32px)] leading-none px-1`} onClick={() => openModal("order")}>
              <div className="btn-shine-layer" />
              <span className="relative z-10">Заказать</span>
            </button>
            <button type="button" className={`${navCellClass(false)} border-t border-white/20 text-[clamp(23px,7vw,32px)] leading-none px-1`} onClick={() => router.push("/")}>На главную</button>
          </div>
          <div className="grid h-1/2 grid-cols-3 border-t border-white/20">
            <button type="button" className={`${navCellClass(false)} text-[clamp(14px,3.7vw,20px)] leading-tight px-1`} onClick={() => openModal("certificates")}>Сертификаты</button>
            <button type="button" className={`${navCellClass(false)} text-[clamp(18px,4.6vw,25px)] leading-tight px-1`} onClick={handleReviewsClick}>
              {reviewsStatus === "underDev" ? "В разработке" : "Отзывы"}
            </button>
            <button type="button" className={`${navCellClass(false)} text-[clamp(16px,4.4vw,23px)] leading-tight px-1`} onClick={() => openModal("siteCreator")}>Нужен сайт?</button>
          </div>
        </div>
      )}
    </nav>
  );
}
