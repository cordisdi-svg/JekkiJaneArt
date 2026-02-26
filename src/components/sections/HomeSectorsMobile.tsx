"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type MobileSlot = { label: string; href: string; weight: number };

const slots: MobileSlot[] = [
  { label: "Доступные картины", href: "/available", weight: 12.5 },
  { label: "Роспись стен и мебели", href: "/walls", weight: 12.5 },
  { label: "Роспись одежды и обуви", href: "/wear-and-shoes", weight: 21 },
  { label: "Картины-талисманы", href: "/amulets", weight: 21 },
  { label: "Тату эскизы", href: "/tattoo", weight: 12.5 },
  { label: "Картины на заказ", href: "/custom-paintings", weight: 12.5 }
];

const centeredSlots = new Set([0, 1, 4, 5]);
const cx = -8;
const cy = 108;
const r = 74;
const mobilePath = `M ${cx - r} ${cy} A ${r} ${r} 0 1 0 ${cx + r} ${cy} A ${r} ${r} 0 1 0 ${cx - r} ${cy} Z`;

const buildSlotPolygon = (top: number, height: number) => {
  const y0 = top;
  const y1 = top + height;
  const points: string[] = [`0% ${y0}%`, `100% ${y0}%`, `100% ${y1}%`, `0% ${y1}%`];
  const samples = 20;
  for (let i = 0; i <= samples; i += 1) {
    const y = y1 - ((y1 - y0) * i) / samples;
    const term = Math.max(0, r * r - (y - cy) * (y - cy));
    const x = Math.min(50, Math.max(0, cx + Math.sqrt(term)));
    if (x > 0) points.push(`${x}% ${y}%`);
  }
  return `polygon(${points.join(",")})`;
};

export function HomeSectorsMobile() {
  const router = useRouter();
  const [active, setActive] = useState<number | "center" | null>(null);

  const slotShapes = useMemo(
    () => {
      const total = slots.reduce((sum, slot) => sum + slot.weight, 0);
      let offset = 0;
      return slots.map((slot, index) => {
        const top = (offset / total) * 100;
        const height = (slot.weight / total) * 100;
        offset += slot.weight;
        return { ...slot, index, top, height, clipPath: buildSlotPolygon(top, height), isActive: active === index, isDim: active !== null && active !== index };
      });
    },
    [active]
  );

  const trigger = (target: number | "center", href: string) => {
    if (active !== null) return;
    setActive(target);
    window.setTimeout(() => router.push(href), 1000);
  };

  return (
    <section className="relative h-[calc(100svh-var(--nav-height-mobile))] w-full overflow-hidden lg:hidden" aria-label="Мобильные разделы">
      {slotShapes.map((slot) => (
        <button
          key={slot.href}
          type="button"
          onClick={() => trigger(slot.index, slot.href)}
          aria-label={slot.label}
          className="absolute left-0 w-full border-0 bg-transparent p-0 text-white transition-opacity duration-200 focus-visible:ring-2 focus-visible:ring-white"
          style={{
            top: `${slot.top}%`,
            height: `${slot.height}%`,
            clipPath: slot.clipPath,
            WebkitClipPath: slot.clipPath,
            opacity: slot.isDim ? 0.3 : 1,
            backgroundColor: slot.isActive ? "rgba(255,255,255,0.20)" : "rgba(255,255,255,0.10)",
            boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.55)"
          }}
        >
          <span className={`block px-4 text-2xl leading-tight drop-shadow-[0_2px_3px_rgba(0,0,0,0.75)] ${centeredSlots.has(slot.index) ? "text-center" : "pl-[52%] text-left"}`}>
            {slot.label}
          </span>
        </button>
      ))}

      <div className="absolute left-0 top-1/2 z-20 h-1/2 w-1/2 -translate-y-1/2 overflow-hidden" style={{ maskImage: "radial-gradient(circle 74% at -8% 108%, #000 99%, transparent 100%)", WebkitMaskImage: "radial-gradient(circle 74% at -8% 108%, #000 99%, transparent 100%)" }} aria-hidden>
        <Image src="/mainpage/mainpage-icon-mobile.png" alt="JEKKI JANE ART" fill className="scale-[1.12] object-cover object-center" />
      </div>

      <div className="absolute left-0 top-1/2 z-30 h-1/2 w-1/2 -translate-y-1/2">
        <button
          type="button"
          onClick={() => trigger("center", "/about")}
          aria-label="О художнице"
          className="sr-only"
        >
          О художнице
        </button>
        <svg viewBox="0 0 100 100" className="h-full w-full" preserveAspectRatio="none">
          <path d={mobilePath} fill="rgba(0,0,0,0.001)" stroke="rgba(255,255,255,0.55)" strokeWidth="1.5" pointerEvents="all" onClick={() => trigger("center", "/about")} />
        </svg>
      </div>
    </section>
  );
}
