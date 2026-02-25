"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type MobileSlot = { label: string; href: string };

const W = 1000;
const H = 1000;
const ROW_WEIGHTS = [12.5, 12.5, 21, 21, 12.5, 12.5];
const CIRCLE_R = H * 0.25;
const CIRCLE_CX = CIRCLE_R;
const CIRCLE_CY = H / 2;

const slots: MobileSlot[] = [
  { label: "Доступные картины", href: "/available" },
  { label: "Роспись стен и мебели", href: "/walls" },
  { label: "Роспись одежды и обуви", href: "/wear-and-shoes" },
  { label: "Картины на заказ", href: "/custom-paintings" },
  { label: "Картины-талисманы", href: "/amulets" },
  { label: "Тату эскизы", href: "/tattoo" }
];

const cumulativeRows = ROW_WEIGHTS.reduce<number[]>((acc, value, index) => {
  const prev = index === 0 ? 0 : acc[index - 1];
  acc.push(prev + value);
  return acc;
}, []);

const yByRow = cumulativeRows.map((sum) => (sum / cumulativeRows[cumulativeRows.length - 1]) * H);

const circleCutoutPath = () => {
  const x = CIRCLE_CX;
  const y = CIRCLE_CY;
  const r = CIRCLE_R;
  return `M ${x - r} ${y} A ${r} ${r} 0 1 0 ${x + r} ${y} A ${r} ${r} 0 1 0 ${x - r} ${y} Z`;
};

export function HomeSectorsMobile() {
  const router = useRouter();
  const [active, setActive] = useState<number | "center" | null>(null);

  const slotBounds = useMemo(() => {
    const starts = [0, ...yByRow.slice(0, -1)];
    return starts.map((start, i) => ({ y0: start, y1: yByRow[i] }));
  }, []);

  const tap = (target: number | "center", href: string) => {
    if (active !== null) return;
    setActive(target);
    window.setTimeout(() => router.push(href), 1000);
  };

  return (
    <section className="relative h-[calc(100vh-var(--nav-height-mobile))] w-full lg:hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full">
        <defs>
          <path id="mobile-circle-cutout" d={circleCutoutPath()} />
        </defs>

        {slotBounds.map((slot, index) => {
          const isActive = active === index;
          const dim = active !== null && active !== index;
          const rectPath = `M 0 ${slot.y0} H ${W} V ${slot.y1} H 0 Z`;

          return (
            <g key={slots[index].href} onClick={() => tap(index, slots[index].href)} className="cursor-pointer" style={{ transition: "opacity .22s ease", opacity: dim ? 0.3 : 1 }}>
              <path d={`${rectPath} ${circleCutoutPath()}`} fill={isActive ? "rgba(255,255,255,0.16)" : "rgba(255,255,255,0.06)"} fillRule="evenodd" />
              <text
                x={CIRCLE_R * 2 + 28}
                y={(slot.y0 + slot.y1) / 2}
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

        <g onClick={() => tap("center", "/about")} className="cursor-pointer" style={{ opacity: active !== null && active !== "center" ? 0.3 : 1, transition: "opacity .22s ease" }}>
          <circle cx={CIRCLE_CX} cy={CIRCLE_CY} r={CIRCLE_R} fill={active === "center" ? "rgba(255,255,255,0.18)" : "rgba(20,20,20,0.45)"} />
        </g>
      </svg>

      <button
        type="button"
        onClick={() => tap("center", "/about")}
        className="absolute left-0 top-1/2 block aspect-square h-1/2 -translate-y-1/2 rounded-full"
        aria-label="О художнице"
      >
        <span className="sr-only">О художнице</span>
      </button>

      <div className="pointer-events-none absolute left-0 top-1/2 aspect-square h-1/2 -translate-y-1/2">
        <Image src="/mainpage/mainpage-icon-mobile.png" alt="JEKKI JANE ART" fill className="object-contain" />
      </div>
    </section>
  );
}
