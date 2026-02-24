"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type Sector = { id: number; label: string; href: string };

const sectors: Sector[] = [
  { id: 1, label: "Доступные картины", href: "/available" },
  { id: 2, label: "Роспись стен и мебели", href: "/walls" },
  { id: 3, label: "Роспись одежды и обуви", href: "/wear-and-shoes" },
  { id: 4, label: "Картины-талиманы", href: "/amulets" },
  { id: 5, label: "Тату эскизы", href: "/tattoo" },
  { id: 6, label: "Картины на заказ", href: "/custom-paintings" }
];

const W = 980;
const H = 760;
const CX = W / 2;
const CY = H / 2;
const INNER = 155;
const FAR = 1300;

const polar = (deg: number, r: number) => {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: CX + Math.cos(rad) * r, y: CY + Math.sin(rad) * r };
};

const sectorPath = (start: number, end: number) => {
  const p1 = polar(start, INNER);
  const p2 = polar(start, FAR);
  const p3 = polar(end, FAR);
  const p4 = polar(end, INNER);
  return `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y} L ${p3.x} ${p3.y} L ${p4.x} ${p4.y} Z`;
};

export function HomeSectorsDesktop() {
  const router = useRouter();
  const [hovered, setHovered] = useState<number | "center" | null>(null);

  const shaped = useMemo(
    () =>
      sectors.map((sector, i) => {
        const mid = i * 60;
        const start = mid - 30;
        const end = mid + 30;
        const labelPos = polar(mid, 340);
        return { ...sector, path: sectorPath(start, end), labelPos };
      }),
    []
  );

  return (
    <section className="hidden min-h-screen items-center justify-center px-4 lg:flex">
      <div className="relative h-[min(78vh,760px)] w-[min(92vw,980px)]">
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
                <text x={sector.labelPos.x} y={sector.labelPos.y} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="30" style={{ textShadow: "0 1px 2px rgba(0,0,0,.8)" }}>
                  {sector.label}
                </text>
              </g>
            );
          })}
          <g className="cursor-pointer" onMouseEnter={() => setHovered("center")} onMouseLeave={() => setHovered(null)} onClick={() => router.push("/about")}> 
            <circle cx={CX} cy={CY} r={INNER} fill="rgba(20,20,20,0.38)" stroke={hovered === "center" ? "#fff" : "rgba(255,255,255,0.7)"} strokeWidth={hovered === "center" ? 4 : 2} />
            {hovered === "center" ? (
              <text x={CX} y={CY + 126} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="30">О художнице</text>
            ) : null}
          </g>
        </svg>
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[210px] w-[210px] -translate-x-1/2 -translate-y-1/2">
          <Image src="/mainpage/mainpage-icon.png" alt="JEKKI JANE ART" fill className="object-contain" />
        </div>
      </div>
    </section>
  );
}
