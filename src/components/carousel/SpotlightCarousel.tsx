"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { TouchEvent, useEffect, useMemo, useState } from "react";

export type SpotlightItem = { id: string; src: string; alt: string };

export function SpotlightCarousel({
  items,
  initialIndex = 0,
  onCenterActionLeft,
  onCenterActionRight,
  centerButtons,
  onCenterImageClick,
  className = "",
  centerImageFit = "object-contain"
}: {
  items: SpotlightItem[];
  initialIndex?: number;
  onCenterActionLeft?: (item: SpotlightItem) => void;
  onCenterActionRight?: (item: SpotlightItem) => void;
  centerButtons?: { leftLabel: string; rightLabel: string };
  onCenterImageClick?: (item: SpotlightItem) => void;
  className?: string;
  centerImageFit?: "object-contain" | "object-cover";
}) {
  const [index, setIndex] = useState(initialIndex);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  useEffect(() => setIndex(initialIndex), [initialIndex]);

  const previous = () => setIndex((prev) => (prev - 1 + items.length) % items.length);
  const next = () => setIndex((prev) => (prev + 1) % items.length);

  const visible = useMemo(() => {
    const at = (offset: number) => items[(index + offset + items.length) % items.length];
    return { farLeft: at(-2), left: at(-1), center: at(0), right: at(1), farRight: at(2) };
  }, [index, items]);

  return (
    <div className={`relative h-full w-full ${className}`} onWheel={(e) => (e.deltaY > 0 ? next() : previous())}>
      {!isMobile ? (
        <>
          <button type="button" onClick={previous} className="absolute left-0 top-0 z-20 hidden h-full w-10 items-center justify-center bg-black/20 md:flex">
            <Triangle direction="left" />
          </button>
          <button type="button" onClick={next} className="absolute right-0 top-0 z-20 hidden h-full w-10 items-center justify-center bg-black/20 md:flex">
            <Triangle direction="right" />
          </button>
        </>
      ) : (
        <div className="pointer-events-none absolute inset-y-0 left-0 right-0 z-10">
          <div className="mobile-triangle-hint absolute left-2 top-1/2 -translate-y-1/2"><Triangle direction="left" /></div>
          <div className="mobile-triangle-hint absolute right-2 top-1/2 -translate-y-1/2"><Triangle direction="right" /></div>
        </div>
      )}

      <div className="mx-auto h-full overflow-hidden px-0 md:px-10">
        {isMobile ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={visible.center.id}
              initial={{ opacity: 0.45, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0.45, x: -50 }}
              transition={{ duration: 0.35 }}
              className="h-full"
              onTouchStart={(e: TouchEvent<HTMLDivElement>) => (e.currentTarget.dataset.touchX = String(e.touches[0].clientX))}
              onTouchEnd={(e: TouchEvent<HTMLDivElement>) => {
                const startX = Number(e.currentTarget.dataset.touchX ?? 0);
                const diff = e.changedTouches[0].clientX - startX;
                if (Math.abs(diff) > 35) {
                  if (diff < 0) next();
                  if (diff > 0) previous();
                }
              }}
            >
              <CarouselCard
                item={visible.center}
                center
                buttons={centerButtons}
                onLeft={onCenterActionLeft}
                onRight={onCenterActionRight}
                onImageClick={onCenterImageClick}
                imageFit={centerImageFit}
              />
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="flex h-full items-stretch justify-center gap-2">
            <CarouselCard item={visible.farLeft} dim tiny />
            <CarouselCard item={visible.left} dim narrow />
            <AnimatePresence mode="wait">
              <motion.div key={visible.center.id} initial={{ opacity: 0.45, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0.45, x: -50 }} transition={{ duration: 0.35 }} className="h-full w-[40%]">
                <CarouselCard
                  item={visible.center}
                  center
                  buttons={centerButtons}
                  onLeft={onCenterActionLeft}
                  onRight={onCenterActionRight}
                  onImageClick={onCenterImageClick}
                  imageFit={centerImageFit}
                />
              </motion.div>
            </AnimatePresence>
            <CarouselCard item={visible.right} dim narrow />
            <CarouselCard item={visible.farRight} dim tiny />
          </div>
        )}
      </div>
    </div>
  );
}

function Triangle({ direction }: { direction: "left" | "right" }) {
  return (
    <svg viewBox="0 0 20 20" className="h-6 w-6 fill-white/80" aria-hidden>
      {direction === "left" ? <path d="M13 3 5 10l8 7V3Z" /> : <path d="M7 3v14l8-7-8-7Z" />}
    </svg>
  );
}

function CarouselCard({
  item,
  dim,
  center,
  tiny,
  narrow,
  buttons,
  onLeft,
  onRight,
  onImageClick,
  imageFit = "object-contain"
}: {
  item: SpotlightItem;
  dim?: boolean;
  center?: boolean;
  tiny?: boolean;
  narrow?: boolean;
  buttons?: { leftLabel: string; rightLabel: string };
  onLeft?: (item: SpotlightItem) => void;
  onRight?: (item: SpotlightItem) => void;
  onImageClick?: (item: SpotlightItem) => void;
  imageFit?: "object-contain" | "object-cover";
}) {
  const widthClass = tiny ? "w-[10%]" : narrow ? "w-[19%]" : "w-full";
  return (
    <div className={`relative h-full overflow-hidden rounded-xl ${widthClass}`}>
      <button type="button" onClick={() => onImageClick?.(item)} className={`relative block h-full w-full ${dim ? "opacity-40 blur-[1px]" : "opacity-100"} transition-all`}>
        <Image src={item.src} alt={item.alt} fill className={center ? imageFit : "object-cover"} />
      </button>
      {center && buttons ? (
        <div className="absolute bottom-3 left-3 right-3">
          <div className="flex h-9 gap-2">
            <button type="button" onClick={() => onLeft?.(item)} className="w-2/3 rounded-lg border border-[#C2185B] bg-white text-xs text-[#D81B60] md:text-sm">{buttons.leftLabel}</button>
            <button type="button" onClick={() => onRight?.(item)} className="w-1/3 rounded-lg border border-[#C2185B] bg-white text-xs text-[#D81B60] md:text-sm">{buttons.rightLabel}</button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
