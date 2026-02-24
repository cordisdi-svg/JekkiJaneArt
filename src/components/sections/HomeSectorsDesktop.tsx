"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type Sector = { id: number; label: string; image: string; href: string };

const sectors: Sector[] = [
  { id: 1, label: "Доступные картины", image: "/availablepics/(tech).JPEG", href: "/available" },
  { id: 2, label: "Роспись стен и мебели", image: "/walls/1.png", href: "/walls" },
  { id: 3, label: "Роспись одежды и обуви", image: "/wear-and-shoes/3-(tech).png", href: "/wear-and-shoes" },
  { id: 4, label: "Картины-талиманы", image: "/amulets/1-(tech).png", href: "/amulets" },
  { id: 5, label: "Тату эскизы", image: "/tattoo/1-(tech).png", href: "/tattoo" },
  { id: 6, label: "Картины на заказ", image: "/picstoorder/pic2.JPG", href: "/custom-paintings" }
];

const SIZE = 760;
const CENTER = SIZE / 2;
const OUTER = 350;
const INNER = 105;

const polar = (angle: number, radius: number) => {
  const rad = ((angle - 90) * Math.PI) / 180;
  return { x: CENTER + radius * Math.cos(rad), y: CENTER + radius * Math.sin(rad) };
};

const wedgePath = (start: number, end: number) => {
  const a = polar(start, OUTER);
  const b = polar(end, OUTER);
  const c = polar(end, INNER);
  const d = polar(start, INNER);
  return `M ${a.x} ${a.y} A ${OUTER} ${OUTER} 0 0 1 ${b.x} ${b.y} L ${c.x} ${c.y} A ${INNER} ${INNER} 0 0 0 ${d.x} ${d.y} Z`;
};

export function HomeSectorsDesktop() {
  const router = useRouter();
  const [hovered, setHovered] = useState<number | "center" | null>(null);

  const sectorsWithPath = useMemo(
    () =>
      sectors.map((sector, index) => {
        const start = index * 60;
        const end = start + 60;
        const mid = start + 30;
        const labelP = polar(mid, 235);
        return { ...sector, path: wedgePath(start, end), labelP };
      }),
    []
  );

  return (
    <section className="hidden min-h-screen items-center justify-center lg:flex">
      <div className="relative h-[min(84vh,760px)] w-[min(84vw,760px)]">
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="h-full w-full overflow-visible">
          <defs>
            {sectorsWithPath.map((sector) => (
              <clipPath id={`sector-clip-${sector.id}`} key={sector.id}>
                <path d={sector.path} />
              </clipPath>
            ))}
          </defs>
          {sectorsWithPath.map((sector) => {
            const isHovered = hovered === sector.id;
            const shouldDim = hovered !== null && hovered !== sector.id;
            return (
              <g
                key={sector.id}
                style={{
                  transformOrigin: `${CENTER}px ${CENTER}px`,
                  transform: isHovered ? "scale(1.02)" : "scale(1)",
                  opacity: shouldDim ? 0.35 : 1,
                  filter: shouldDim ? "blur(1px)" : "none",
                  transition: "all .25s ease"
                }}
                onMouseEnter={() => setHovered(sector.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => router.push(sector.href)}
                className="cursor-pointer"
              >
                {isHovered ? (
                  <>
                    <image href={sector.image} x="0" y="0" width={SIZE} height={SIZE} preserveAspectRatio="xMidYMid slice" clipPath={`url(#sector-clip-${sector.id})`} />
                    <path d={sector.path} fill="rgba(0,0,0,0.35)" />
                  </>
                ) : null}
                <path d={sector.path} fill="transparent" stroke={isHovered ? "#ffffff" : "rgba(255,255,255,0.7)"} strokeWidth={isHovered ? 4 : 2} />
                <text x={sector.labelP.x} y={sector.labelP.y} textAnchor="middle" dominantBaseline="middle" fontSize="24" fill="white" style={{ textShadow: "0 1px 2px rgba(0,0,0,.8)" }}>
                  {sector.label}
                </text>
              </g>
            );
          })}
          <g onMouseEnter={() => setHovered("center")} onMouseLeave={() => setHovered(null)} onClick={() => router.push("/about")} className="cursor-pointer">
            <circle cx={CENTER} cy={CENTER} r={INNER - 8} fill="rgba(20,20,20,0.38)" stroke={hovered === "center" ? "#fff" : "rgba(255,255,255,0.6)"} strokeWidth={hovered === "center" ? 4 : 2} />
            {hovered === "center" ? (
              <text x={CENTER} y={CENTER + 4} textAnchor="middle" dominantBaseline="middle" fontSize="28" fill="white">
                О художнице
              </text>
            ) : null}
          </g>
        </svg>
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[180px] w-[180px] -translate-x-1/2 -translate-y-1/2">
          <Image src="/mainpage/mainpage-icon.png" alt="JEKKI JANE ART" fill className="object-contain" />
        </div>
      </div>
    </section>
  );
}
