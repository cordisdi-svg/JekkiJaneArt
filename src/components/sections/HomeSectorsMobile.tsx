"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

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
  const { ref, width, height } = useElementSize();
  const [active, setActive] = useState<number | "center" | null>(null);

  const radius = height * 0.25;
  const circleX = radius;
  const circleY = height / 2;

  const slotBounds = useMemo(() => {
    if (!height) return [];
    const total = ROW_WEIGHTS.reduce((acc, item) => acc + item, 0);
    let cursor = 0;

    return ROW_WEIGHTS.map((row) => {
      const y0 = cursor;
      cursor += (row / total) * height;
      return { y0, y1: cursor };
    });
  }, [height]);

  const circleCutoutPath = useMemo(() => {
    if (!height) return "";
    return `M ${circleX - radius} ${circleY} A ${radius} ${radius} 0 1 0 ${circleX + radius} ${circleY} A ${radius} ${radius} 0 1 0 ${circleX - radius} ${circleY} Z`;
  }, [circleX, circleY, height, radius]);

  const tap = (target: number | "center", href: string) => {
    if (active !== null) return;
    setActive(target);
    window.setTimeout(() => router.push(href), 1000);
  };

  if (width < 10 || height < 10) {
    return <div ref={ref} className="relative h-full w-full overflow-hidden lg:hidden" />;
  }

  return (
    <div ref={ref} className="relative h-full w-full overflow-hidden lg:hidden">
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
        {slotBounds.map((slot, index) => {
          const isActive = active === index;
          const dim = active !== null && active !== index;
          const rectPath = `M 0 ${slot.y0} H ${width} V ${slot.y1} H 0 Z`;
          const isMiddleSlot = index === 2 || index === 3;
          const labelX = isMiddleSlot ? radius * 2 + 24 : radius * 2 + (width - radius * 2) / 2;

          return (
            <g key={slots[index].href} onClick={() => tap(index, slots[index].href)} className="cursor-pointer" style={{ opacity: dim ? 0.35 : 1, transition: "opacity .22s ease" }}>
              <path d={`${rectPath} ${circleCutoutPath}`} fill={isActive ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0)"} fillRule="evenodd" pointerEvents="all" />
              <text
                x={labelX}
                y={(slot.y0 + slot.y1) / 2}
                textAnchor={isMiddleSlot ? "start" : "middle"}
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
      </svg>

      <button
        type="button"
        onClick={() => tap("center", "/about")}
        className="absolute"
        style={{
          left: 0,
          top: "50%",
          width: radius * 2,
          height: radius * 2,
          transform: "translateY(-50%)",
          clipPath: "circle(50% at 50% 50%)",
          opacity: active !== null && active !== "center" ? 0.35 : 1,
          background: active === "center" ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0)"
        }}
        aria-label="О художнице"
      >
        <span className="sr-only">О художнице</span>
      </button>

      <div className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2" style={{ width: radius * 2, height: radius * 2 }}>
        <Image src="/mainpage/mainpage-icon-mobile.png" alt="JEKKI JANE ART" fill className="object-contain" />
      </div>
    </div>
  );
}
