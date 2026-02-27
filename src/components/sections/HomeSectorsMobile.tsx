"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

type MobileSlot = { label: string; href: string };

const ROWS = "12.5fr 21fr 21fr 12.5fr 12.5fr 12.5fr";

const slots: MobileSlot[] = [
  { label: "Доступные картины", href: "/available" },
  { label: "Роспись стен и мебели", href: "/walls" },
  { label: "Роспись одежды и обуви", href: "/wear-and-shoes" },
  { label: "Картины на заказ", href: "/custom-paintings" },
  { label: "Картины-талисманы", href: "/amulets" },
  { label: "Тату эскизы", href: "/tattoo" }
];

const centered = new Set([0, 1, 4, 5]);

export function HomeSectorsMobile() {
  const router = useRouter();
  const [active, setActive] = useState<number | "center" | null>(null);

  const trigger = (target: number | "center", href: string) => {
    if (active !== null) return;
    setActive(target);
    window.setTimeout(() => router.push(href), 1000);
  };

  return (
    <section className="relative h-full w-full overflow-hidden lg:hidden" aria-label="Мобильные разделы">
      <div className="absolute inset-0 grid" style={{ gridTemplateRows: ROWS }}>
        {slots.map((slot, index) => {
          const isDim = active !== null && active !== index;
          const isActive = active === index;
          return (
            <button
              key={slot.href}
              type="button"
              onClick={() => trigger(index, slot.href)}
              aria-label={slot.label}
              className="relative w-full border-0 text-white transition-opacity duration-200"
              style={{
                opacity: isDim ? 0.32 : 1,
                backgroundColor: isActive ? "rgba(255,255,255,0.16)" : "rgba(255,255,255,0.07)",
                textAlign: centered.has(index) ? "center" : "left",
                paddingLeft: centered.has(index) ? "1rem" : "56%"
              }}
            >
              <span className="pointer-events-none text-2xl leading-tight drop-shadow-[0_2px_3px_rgba(0,0,0,0.75)]">{slot.label}</span>
            </button>
          );
        })}
      </div>

      <svg className="pointer-events-none absolute inset-0 z-10 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
        <defs>
          <mask id="mobile-slot-border-cutout">
            <rect x="0" y="0" width="100" height="100" fill="white" />
            <circle cx="25" cy="50" r="25" fill="black" />
          </mask>
        </defs>
        <g mask="url(#mobile-slot-border-cutout)" fill="none" stroke="#42545f" strokeWidth="3" vectorEffect="non-scaling-stroke">
          <rect x="0" y="0" width="100" height="13.5135135" />
          <rect x="0" y="13.5135135" width="100" height="22.7027027" />
          <rect x="0" y="36.2162162" width="100" height="22.7027027" />
          <rect x="0" y="58.9189189" width="100" height="13.5135135" />
          <rect x="0" y="72.4324324" width="100" height="13.5135135" />
          <rect x="0" y="85.9459459" width="100" height="14.0540541" />
        </g>
      </svg>

      <div className="absolute left-0 top-1/2 z-20 h-1/2 w-[50vw] -translate-y-1/2" style={{ pointerEvents: "none" }}>
        <Image src="/mainpage/mainpage-icon-mobile.png" alt="JEKKI JANE ART" fill className="object-contain" />
      </div>

      <div className="absolute left-0 top-1/2 z-30 h-1/2 w-[50vw] -translate-y-1/2" style={{ pointerEvents: "none" }}>
        <button
          type="button"
          onClick={() => trigger("center", "/about")}
          aria-label="О художнице"
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-transparent"
          style={{
            width: "70.710678%",
            height: "70.710678%",
            pointerEvents: "auto",
            opacity: active !== null && active !== "center" ? 0.35 : 1
          }}
        />
      </div>
    </section>
  );
}
