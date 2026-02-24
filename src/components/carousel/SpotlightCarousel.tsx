"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

export type SpotlightItem = { id: string; src: string; alt: string };

export function SpotlightCarousel({
  items,
  initialIndex = 0,
  onCenterActionLeft,
  onCenterActionRight,
  centerButtons
}: {
  items: SpotlightItem[];
  initialIndex?: number;
  onCenterActionLeft?: (item: SpotlightItem) => void;
  onCenterActionRight?: (item: SpotlightItem) => void;
  centerButtons?: { leftLabel: string; rightLabel: string };
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
    <div className="relative w-full overflow-hidden px-2 md:px-8" onWheel={(e) => (e.deltaY > 0 ? next() : previous())}>
      <button type="button" onClick={previous} className="absolute left-0 top-1/2 z-20 hidden -translate-y-1/2 rounded-full bg-white/80 p-2 md:block">◀</button>
      <button type="button" onClick={next} className="absolute right-0 top-1/2 z-20 hidden -translate-y-1/2 rounded-full bg-white/80 p-2 md:block">▶</button>
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-3 md:grid-cols-3">
        {!isMobile ? (
          <div className="hidden md:block">
            <CarouselCard item={visible.left} dim />
          </div>
        ) : null}
        <AnimatePresence mode="wait">
          <motion.div key={visible.center.id} initial={{ opacity: 0.4, x: 80 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0.4, x: -80 }} transition={{ duration: 0.35 }}>
            <CarouselCard item={visible.center} center buttons={centerButtons} onLeft={onCenterActionLeft} onRight={onCenterActionRight} />
          </motion.div>
        </AnimatePresence>
        {!isMobile ? (
          <div className="hidden md:block">
            <CarouselCard item={visible.right} dim />
          </div>
        ) : null}
      </div>
    </div>
  );
}

function CarouselCard({
  item,
  dim,
  center,
  buttons,
  onLeft,
  onRight
}: {
  item: SpotlightItem;
  dim?: boolean;
  center?: boolean;
  buttons?: { leftLabel: string; rightLabel: string };
  onLeft?: (item: SpotlightItem) => void;
  onRight?: (item: SpotlightItem) => void;
}) {
  return (
    <div className={`relative overflow-hidden rounded-xl border border-white/50 bg-black/20 ${center ? "scale-100 md:scale-105" : "scale-95"}`}>
      <div className={`relative h-[55vh] w-full ${dim ? "opacity-45 blur-[2px]" : "opacity-100"} transition-all`}>
        <Image src={item.src} alt={item.alt} fill className="object-contain" />
      </div>
      {center && buttons ? (
        <div className="absolute bottom-2 left-2 right-2 flex h-[8.5%] min-h-10 gap-2">
          <button type="button" onClick={() => onLeft?.(item)} className="w-2/3 rounded-lg border border-[#C2185B] bg-white text-xs text-[#D81B60] md:text-sm">{buttons.leftLabel}</button>
          <button type="button" onClick={() => onRight?.(item)} className="w-1/3 rounded-lg border border-[#C2185B] bg-white text-xs text-[#D81B60] md:text-sm">{buttons.rightLabel}</button>
        </div>
      ) : null}
    </div>
  );
}
