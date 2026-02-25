"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useElementSize } from "@/hooks/useElementSize";

type MobileSlot = { label: string; href: string };

const ROW_WEIGHTS = [12.5, 12.5, 21, 21, 12.5, 12.5];

const slots: MobileSlot[] = [
  { label: "Доступные картины", href: "/available" },
  { label: "Роспись стен и мебели", href: "/walls" },
  { label: "Роспись одежды и обуви", href: "/wear-and-shoes" },
  { label: "Картины на заказ", href: "/custom-paintings" },
  { label: "Картины-талисманы", href: "/amulets" },
  { label: "Тату эскизы", href: "/tattoo" }
];

export function HomeSectorsMobile() {
  const router = useRouter();
  const [active, setActive] = useState<number | "center" | null>(null);
  const { ref, width, height } = useElementSize();

  const tap = (target: number | "center", href: string) => {
    if (active !== null) return;
    setActive(target);
    window.setTimeout(() => router.push(href), 1000);
  };

  const W = width;
  const H = height;
  const R = H * 0.25;
  const Cx = R;
  const Cy = H / 2;

  const circlePath = `M ${Cx - R} ${Cy} A ${R} ${R} 0 1 0 ${Cx + R} ${Cy} A ${R} ${R} 0 1 0 ${Cx - R} ${Cy} Z`;

  const total = ROW_WEIGHTS.reduce((sum, value) => sum + value, 0);
  let current = 0;
  const rowBounds = ROW_WEIGHTS.map((weight) => {
    const y0 = (current / total) * H;
    current += weight;
    const y1 = (current / total) * H;
    return { y0, y1 };
  });

  const rightPanelCenterX = 2 * R + (W - 2 * R) / 2;

  return (
    <section ref={ref} className="relative h-[calc(100vh-var(--nav-height-mobile))] w-full lg:hidden">
      {W > 0 && H > 0 ? (
      <>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        {rowBounds.map((slot, index) => {
          const isActive = active === index;
          const dim = active !== null && active !== index;
          const rectPath = `M 0 ${slot.y0} H ${W} V ${slot.y1} H 0 Z`;
          const path = `${rectPath} ${circlePath}`;
          const centered = index === 0 || index === 1 || index === 4 || index === 5;

          return (
            <g key={slots[index].href} onClick={() => tap(index, slots[index].href)} className="cursor-pointer" style={{ transition: "opacity .22s ease", opacity: dim ? 0.35 : 1 }}>
              <path d={path} fill="rgba(0,0,0,0)" fillRule="evenodd" pointerEvents="all" />
              {isActive ? <path d={path} fill="rgba(255,255,255,0.14)" fillRule="evenodd" pointerEvents="none" /> : null}
              <text
                x={centered ? rightPanelCenterX : 2 * R + 24}
                y={(slot.y0 + slot.y1) / 2}
                textAnchor={centered ? "middle" : "start"}
                dominantBaseline="middle"
                fill="white"
                fontSize="32"
                style={{ textShadow: "0 1px 2px rgba(0,0,0,.75)" }}
              >
                {slots[index].label}
              </text>
            </g>
          );
        })}

        <circle cx={Cx} cy={Cy} r={R} fill={active === "center" ? "rgba(255,255,255,0.14)" : "rgba(20,20,20,0.45)"} pointerEvents="none" />
      </svg>

      <button
        type="button"
        onClick={() => tap("center", "/about")}
        className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full"
        style={{ width: 2 * R, height: 2 * R, clipPath: "circle(50% at 50% 50%)" }}
        aria-label="О художнице"
      >
        <span className="sr-only">О художнице</span>
      </button>

      <div className="pointer-events-none absolute left-0 top-1/2 z-[11] -translate-y-1/2" style={{ width: 2 * R, height: 2 * R }}>
        <Image src="/mainpage/mainpage-icon-mobile.png" alt="JEKKI JANE ART" fill className="object-contain" />
      </div>
      </>
      ) : null}
    </section>
  );
}
