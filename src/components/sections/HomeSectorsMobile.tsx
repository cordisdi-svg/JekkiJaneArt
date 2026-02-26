"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type MobileSlot = { label: string; href: string };

const slots: MobileSlot[] = [
  { label: "Доступные картины", href: "/available" },
  { label: "Роспись стен и мебели", href: "/walls" },
  { label: "Роспись одежды и обуви", href: "/wear-and-shoes" },
  { label: "Картины-талисманы", href: "/amulets" },
  { label: "Тату эскизы", href: "/tattoo" },
  { label: "Картины на заказ", href: "/custom-paintings" }
];

const centeredSlots = new Set([0, 1, 4, 5]);

export function HomeSectorsMobile() {
  const router = useRouter();
  const [active, setActive] = useState<number | "center" | null>(null);
  const circleDiameter = "50%";
  const cutoutMask = `radial-gradient(circle at 0% 50%, transparent 0 25%, #000 25.15%)`;

  const slotStates = useMemo(
    () =>
      slots.map((slot, index) => ({
        ...slot,
        isActive: active === index,
        isDim: active !== null && active !== index
      })),
    [active]
  );

  const tap = (target: number | "center", href: string) => {
    if (active !== null) return;
    setActive(target);
    window.setTimeout(() => router.push(href), 1000);
  };

  return (
    <section className="relative h-full w-full overflow-hidden lg:hidden" aria-label="Мобильные разделы">
      <div
        className="absolute inset-0 grid"
        style={{
          gridTemplateRows: "12.5fr 21fr 21fr 12.5fr 12.5fr 12.5fr",
          maskImage: cutoutMask,
          WebkitMaskImage: cutoutMask
        }}
      >
        {slotStates.map((slot, index) => (
          <button
            key={slot.href}
            type="button"
            onClick={() => tap(index, slot.href)}
            aria-label={slot.label}
            className="relative w-full border-0 bg-white/10 px-4 text-white transition-opacity duration-300 focus-visible:ring-2 focus-visible:ring-white"
            style={{ opacity: slot.isDim ? 0.3 : 1, backgroundColor: slot.isActive ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.09)" }}
          >
            <span
              className={`block text-2xl leading-tight drop-shadow-[0_2px_3px_rgba(0,0,0,0.75)] ${centeredSlots.has(index) ? "text-center" : "pl-[52%] text-left"}`}
            >
              {slot.label}
            </span>
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => tap("center", "/about")}
        aria-label="О художнице"
        className="absolute left-0 top-1/2 z-20 -translate-y-1/2 rounded-full border-2 border-white/70 bg-black/35 transition-opacity duration-300 focus-visible:ring-2 focus-visible:ring-white"
        style={{
          width: circleDiameter,
          height: circleDiameter,
          opacity: active !== null && active !== "center" ? 0.35 : 1
        }}
      />

      <div className="pointer-events-none absolute left-0 top-1/2 z-30 -translate-y-1/2 overflow-hidden rounded-full" style={{ width: circleDiameter, height: circleDiameter }}>
        <Image src="/mainpage/mainpage-icon-mobile.png" alt="JEKKI JANE ART" fill className="scale-[1.12] object-cover" />
      </div>
    </section>
  );
}
