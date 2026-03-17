"use client";

import { useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { orderedRoutes } from "@/data/routes";
import { useModal } from "@/components/modals/ModalProvider";

function Triangle({ direction }: { direction: "left" | "right" }) {
  return (
    <svg viewBox="0 0 20 20" className="h-5 w-5 fill-white" aria-hidden>
      {direction === "left" ? <path d="M13 3 5 10l8 7V3Z" /> : <path d="M7 3v14l8-7-8-7Z" />}
    </svg>
  );
}

function navCellClass(isActive: boolean) {
  return `h-full w-full border-l border-white/20 text-white/95 transition-colors hover:bg-white/10 ${isActive ? "bg-white/15" : ""
    }`;
}

export function BottomNavigation() {
  const router = useRouter();
  const pathname = usePathname();
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
      className="fixed bottom-0 left-0 z-[100] w-full"
      style={{
        background: "rgba(0, 0, 0, 0.15)", // Matching walls page bg-black/15
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderTop: "1px solid rgba(255,255,255,0.12)",
        fontFamily: "'RavenholmBold', serif",
        letterSpacing: "0.02em",
      }}
      aria-label="Bottom navigation"
    >
      <div className="hidden h-[var(--nav-height-desktop)] w-full lg:flex">
        <button type="button" className="flex h-full w-[5%] items-center justify-center border-r border-white/20" onClick={handlePrev} aria-label="Предыдущая страница">
          <Triangle direction="left" />
        </button>
        <button type="button" className={`${navCellClass(pathname === "/")} w-[16.25%] text-[clamp(14px,1.8vw,26px)] leading-none px-1`} onClick={() => router.push("/")}>На главную</button>
        <button type="button" className={`${navCellClass(false)} w-[16.25%] text-[clamp(14px,1.8vw,26px)] leading-none px-1`} onClick={() => openModal("siteCreator")}>Нужен сайт?</button>
        <button type="button" className={`${navCellClass(false)} w-[25%] text-[clamp(16px,2.2vw,32px)] leading-none px-1`} onClick={() => openModal("order")}>Заказать</button>
        <button type="button" className={`${navCellClass(false)} w-[16.25%] text-[clamp(14px,1.8vw,26px)] leading-none px-1`} onClick={handleReviewsClick}>
          {reviewsStatus === "underDev" ? "В разработке" : "Отзывы"}
        </button>
        <button type="button" className={`${navCellClass(false)} w-[16.25%] border-r border-white/20 text-[clamp(14px,1.8vw,26px)] leading-none px-1`} onClick={() => openModal("certificates")}>Сертификаты</button>
        <button type="button" className="flex h-full w-[5%] items-center justify-center" onClick={handleNext} aria-label="Следующая страница">
          <Triangle direction="right" />
        </button>
      </div>

      <div 
        className="relative flex h-[var(--nav-height-mobile)] w-full flex-col lg:hidden" 
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Swipe Indicators Overlay */}
        <div className="pointer-events-none absolute inset-y-0 left-0 right-0 z-10 flex items-center justify-between px-1 opacity-70">
          <div className="scale-75">
            <Triangle direction="left" />
          </div>
          <div className="scale-75">
            <Triangle direction="right" />
          </div>
        </div>

        <div className="grid h-1/2 grid-cols-2">
          <button type="button" className={`${navCellClass(false)} border-t border-white/20 text-[clamp(20px,6vw,28px)] leading-none px-1`} onClick={() => openModal("order")}>Заказать</button>
          <button type="button" className={`${navCellClass(pathname === "/")} border-t border-white/20 text-[clamp(20px,6vw,28px)] leading-none px-1`} onClick={() => router.push("/")}>На главную</button>
        </div>
        <div className="grid h-1/2 grid-cols-3 border-t border-white/20">
          <button type="button" className={`${navCellClass(false)} text-[clamp(16px,4vw,22px)] leading-tight px-1`} onClick={() => openModal("certificates")}>Сертификаты</button>
          <button type="button" className={`${navCellClass(false)} text-[clamp(16px,4vw,22px)] leading-tight px-1`} onClick={handleReviewsClick}>
            {reviewsStatus === "underDev" ? "В разработке" : "Отзывы"}
          </button>
          <button type="button" className={`${navCellClass(false)} text-[clamp(14px,3.8vw,20px)] leading-tight px-1`} onClick={() => openModal("siteCreator")}>Нужен сайт?</button>
        </div>
      </div>
    </nav>
  );
}
