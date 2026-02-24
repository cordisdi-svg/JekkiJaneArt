"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type Sector = { id: number; label: string; href: string; start: number; end: number };

const CENTER_RADIUS = 206;
const ICON_SIZE = 315;
const W = 980;
const H = 760;
const CX = W / 2;
const CY = H / 2;
const FAR = 1400;

const sectors: Sector[] = [
  { id: 1, label: "Доступные картины", href: "/available", start: -45, end: 45 },
  { id: 2, label: "Роспись стен и мебели", href: "/walls", start: 45, end: 90 },
  { id: 3, label: "Роспись одежды и обуви", href: "/wear-and-shoes", start: 90, end: 135 },
  { id: 4, label: "Картины-талиманы", href: "/amulets", start: 135, end: 225 },
  { id: 5, label: "Тату эскизы", href: "/tattoo", start: 225, end: 270 },
  { id: 6, label: "Картины на заказ", href: "/custom-paintings", start: 270, end: 315 }
];

const polar = (deg: number, r: number) => {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: CX + Math.cos(rad) * r, y: CY + Math.sin(rad) * r };
};

const wedgePath = (start: number, end: number) => {
  const innerStart = polar(start, CENTER_RADIUS);
  const innerEnd = polar(end, CENTER_RADIUS);
  const outerEnd = polar(end, FAR);
  const outerStart = polar(start, FAR);
  const arcFlag = end - start > 180 ? 1 : 0;
  return [
    `M ${innerStart.x} ${innerStart.y}`,
    `A ${CENTER_RADIUS} ${CENTER_RADIUS} 0 ${arcFlag} 1 ${innerEnd.x} ${innerEnd.y}`,
    `L ${outerEnd.x} ${outerEnd.y}`,
    `L ${outerStart.x} ${outerStart.y}`,
    "Z"
  ].join(" ");
};

export function HomeSectorsDesktop() {
  const router = useRouter();
  const [hovered, setHovered] = useState<number | "center" | null>(null);

  const shaped = useMemo(
    () =>
      sectors.map((sector) => {
        const mid = (sector.start + sector.end) / 2;
        const labelPos = polar(mid, 360);
        return { ...sector, path: wedgePath(sector.start, sector.end), labelPos };
      }),
    []
  );

  return (
    <section className="hidden min-h-screen items-center justify-center px-4 lg:flex">
      <div className="relative h-[min(78vh,760px)] w-[min(92vw,980px)] overflow-hidden">
        <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full">
          {shaped.map((sector) => {
            const isHovered = hovered === sector.id;
            const dim = hovered !== null && hovered !== sector.id;
            return (
              <g
                key={sector.id}
                className="cursor-pointer"
                onMouseEnter={() => setHovered(sector.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => router.push(sector.href)}
                style={{ opacity: dim ? 0.32 : 1, transform: isHovered ? "translateY(-6px)" : "none", transition: "all .2s ease" }}
              >
                <path d={sector.path} fill={isHovered ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.04)"} stroke={isHovered ? "#fff" : "rgba(255,255,255,0.8)"} strokeWidth={isHovered ? 4 : 2} />
                <text x={sector.labelPos.x} y={sector.labelPos.y} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="29" style={{ textShadow: "0 1px 2px rgba(0,0,0,.8)" }}>
                  {sector.label}
                </text>
              </g>
            );
          })}
          <g className="cursor-pointer" onMouseEnter={() => setHovered("center")} onMouseLeave={() => setHovered(null)} onClick={() => router.push("/about")}> 
            <circle cx={CX} cy={CY} r={CENTER_RADIUS} fill="rgba(20,20,20,0.38)" stroke={hovered === "center" ? "#fff" : "rgba(255,255,255,0.7)"} strokeWidth={hovered === "center" ? 4 : 2} />
            {hovered === "center" ? (
              <text x={CX} y={CY + 156} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="30" style={{ textShadow: "0 1px 2px rgba(0,0,0,.8)" }}>
                О художнице
              </text>
            ) : null}
          </g>
        </svg>
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ width: ICON_SIZE, height: ICON_SIZE }}>
          <Image src="/mainpage/mainpage-icon.png" alt="JEKKI JANE ART" fill className="object-contain" />
        </div>
      </div>
    </section>
  );
}
