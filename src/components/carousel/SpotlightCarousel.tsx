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
  className = ""
}: {
  items: SpotlightItem[];
  initialIndex?: number;
  onCenterActionLeft?: (item: SpotlightItem) => void;
  onCenterActionRight?: (item: SpotlightItem) => void;
  centerButtons?: { leftLabel: string; rightLabel: string };
  onCenterImageClick?: (item: SpotlightItem) => void;
  className?: string;
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
    const left = items[(index - 1 + items.length) % items.length];
    const center = items[index];
    const right = items[(index + 1) % items.length];
    return { left, center, right };
  }, [index, items]);

  return (
    <div className={`relative w-full ${className}`} onWheel={(e) => (e.deltaY > 0 ? next() : previous())}>
      <button type="button" onClick={previous} className="absolute left-0 top-0 z-20 hidden h-full w-10 items-center justify-center bg-black/25 md:flex">
        <Triangle direction="left" />
      </button>
      <button type="button" onClick={next} className="absolute right-0 top-0 z-20 hidden h-full w-10 items-center justify-center bg-black/25 md:flex">
        <Triangle direction="right" />
      </button>

      <div className="mx-auto grid h-full max-w-6xl grid-cols-1 gap-3 px-1 md:grid-cols-3 md:px-12">
        {!isMobile ? <CarouselCard item={visible.left} dim /> : null}
        <AnimatePresence mode="wait">
          <motion.div
            key={visible.center.id}
            initial={{ opacity: 0.45, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0.45, x: -60 }}
            transition={{ duration: 0.35 }}
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
            />
          </motion.div>
        </AnimatePresence>
        {!isMobile ? <CarouselCard item={visible.right} dim /> : null}
      </div>
    </div>
  );
}

function Triangle({ direction }: { direction: "left" | "right" }) {
  return (
    <svg viewBox="0 0 20 20" className="h-6 w-6 fill-white" aria-hidden>
      {direction === "left" ? <path d="M13 3 5 10l8 7V3Z" /> : <path d="M7 3v14l8-7-8-7Z" />}
    </svg>
  );
}

function CarouselCard({
  item,
  dim,
  center,
  buttons,
  onLeft,
  onRight,
  onImageClick
}: {
  item: SpotlightItem;
  dim?: boolean;
  center?: boolean;
  buttons?: { leftLabel: string; rightLabel: string };
  onLeft?: (item: SpotlightItem) => void;
  onRight?: (item: SpotlightItem) => void;
  onImageClick?: (item: SpotlightItem) => void;
}) {
  return (
    <div className={`relative h-[calc(100vh-var(--nav-height-mobile)-8.5rem)] lg:h-[calc(100vh-var(--nav-height-desktop)-8.5rem)] overflow-hidden rounded-xl ${center ? "md:scale-[1.02]" : "scale-[0.96]"}`}>
      <button type="button" onClick={() => onImageClick?.(item)} className={`relative block h-full w-full ${dim ? "opacity-45 blur-[1px] md:blur-[2px]" : "opacity-100"} transition-all`}>
        <Image src={item.src} alt={item.alt} fill className="object-contain" />
      </button>
      {center && buttons ? (
        <div className="absolute bottom-3 left-3 right-3 rounded-lg bg-black/20 p-2">
          <div className="flex h-10 gap-2">
            <button type="button" onClick={() => onLeft?.(item)} className="w-2/3 rounded-lg border border-[#C2185B] bg-white text-xs text-[#D81B60] md:text-sm">{buttons.leftLabel}</button>
            <button type="button" onClick={() => onRight?.(item)} className="w-1/3 rounded-lg border border-[#C2185B] bg-white text-xs text-[#D81B60] md:text-sm">{buttons.rightLabel}</button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
