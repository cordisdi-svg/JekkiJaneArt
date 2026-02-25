"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useElementSize } from "@/hooks/useElementSize";

type Sector = { id: number; label: string; href: string; start: number; end: number };
type Point = { x: number; y: number };

const sectors: Sector[] = [
  { id: 1, label: "Доступные картины", href: "/available", start: -30, end: 50 },
  { id: 2, label: "Роспись стен и мебели", href: "/walls", start: 50, end: 90 },
  { id: 3, label: "Роспись одежды и обуви", href: "/wear-and-shoes", start: 90, end: 150 },
  { id: 4, label: "Картины-талиманы", href: "/amulets", start: 150, end: 230 },
  { id: 5, label: "Тату эскизы", href: "/tattoo", start: 230, end: 270 },
  { id: 6, label: "Картины на заказ", href: "/custom-paintings", start: 270, end: 330 }
];

const normalize = (angle: number) => ((angle % 360) + 360) % 360;

const pointOnRay = (angle: number, r: number, cx: number, cy: number): Point => {
  const rad = ((angle - 90) * Math.PI) / 180;
  return { x: cx + Math.cos(rad) * r, y: cy + Math.sin(rad) * r };
};

const angleFromCenter = (p: Point, cx: number, cy: number) => normalize((Math.atan2(p.y - cy, p.x - cx) * 180) / Math.PI + 90);

const rayRectIntersection = (angle: number, width: number, height: number, cx: number, cy: number): Point => {
  const rad = ((angle - 90) * Math.PI) / 180;
  const dx = Math.cos(rad);
  const dy = Math.sin(rad);
  const candidates: Array<Point & { t: number }> = [];

  if (Math.abs(dx) > 1e-6) {
    const tLeft = (0 - cx) / dx;
    const yLeft = cy + tLeft * dy;
    if (tLeft > 0 && yLeft >= 0 && yLeft <= height) candidates.push({ t: tLeft, x: 0, y: yLeft });

    const tRight = (width - cx) / dx;
    const yRight = cy + tRight * dy;
    if (tRight > 0 && yRight >= 0 && yRight <= height) candidates.push({ t: tRight, x: width, y: yRight });
  }

  if (Math.abs(dy) > 1e-6) {
    const tTop = (0 - cy) / dy;
    const xTop = cx + tTop * dx;
    if (tTop > 0 && xTop >= 0 && xTop <= width) candidates.push({ t: tTop, x: xTop, y: 0 });

    const tBottom = (height - cy) / dy;
    const xBottom = cx + tBottom * dx;
    if (tBottom > 0 && xBottom >= 0 && xBottom <= width) candidates.push({ t: tBottom, x: xBottom, y: height });
  }

  const nearest = candidates.filter((candidate) => candidate.t > 0).sort((a, b) => a.t - b.t)[0];
  return nearest ? { x: nearest.x, y: nearest.y } : { x: cx, y: cy };
};

const withinClockwiseArc = (angle: number, start: number, end: number) => {
  const a = normalize(angle);
  const s = normalize(start);
  const e = normalize(end);
  return s <= e ? a >= s && a <= e : a >= s || a <= e;
};

const buildSectorPath = (start: number, end: number, width: number, height: number, cx: number, cy: number, radius: number) => {
  const cornersClockwise: Point[] = [
    { x: width, y: 0 },
    { x: width, y: height },
    { x: 0, y: height },
    { x: 0, y: 0 }
  ];

  const cStart = pointOnRay(start, radius, cx, cy);
  const cEnd = pointOnRay(end, radius, cx, cy);
  const pStart = rayRectIntersection(start, width, height, cx, cy);
  const pEnd = rayRectIntersection(end, width, height, cx, cy);
  const corners = cornersClockwise.filter((corner) => withinClockwiseArc(angleFromCenter(corner, cx, cy), start, end));
  const sweep = end - start >= 0 ? 1 : 0;

  return [
    `M ${cStart.x} ${cStart.y}`,
    `A ${radius} ${radius} 0 0 ${sweep} ${cEnd.x} ${cEnd.y}`,
    `L ${pEnd.x} ${pEnd.y}`,
    ...corners.map((corner) => `L ${corner.x} ${corner.y}`),
    `L ${pStart.x} ${pStart.y}`,
    "Z"
  ].join(" ");
};

export function HomeSectorsDesktop() {
  const router = useRouter();
  const [hovered, setHovered] = useState<number | "center" | null>(null);
  const { ref, width, height } = useElementSize();

  const W = width;
  const H = height;
  const CX = W / 2;
  const CY = H / 2;
  const centerRadius = Math.min(W, H) * 0.176;
  const iconBoxSize = Math.max(0, 2 * centerRadius - 8);

  const shaped = sectors.map((sector) => {
    const mid = normalize((sector.start + sector.end) / 2);
    const labelPos = pointOnRay(mid, Math.min(W, H) * 0.44, CX, CY);
    return { ...sector, path: buildSectorPath(sector.start, sector.end, W, H, CX, CY, centerRadius), labelPos };
  });

  return (
    <section ref={ref} className="relative hidden h-[calc(100vh-var(--nav-height-desktop))] w-full lg:block">
      {W > 0 && H > 0 ? (
      <>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
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
              style={{ opacity: dim ? 0.28 : 1, transform: isHovered ? "translateY(-6px)" : "none", transition: "all .2s ease" }}
            >
              <path d={sector.path} fill={isHovered ? "rgba(255,255,255,0.13)" : "rgba(255,255,255,0.05)"} stroke={isHovered ? "#fff" : "rgba(255,255,255,0.78)"} strokeWidth={isHovered ? 4 : 2} />
              <text x={sector.labelPos.x} y={sector.labelPos.y} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="42" style={{ textShadow: "0 1px 2px rgba(0,0,0,.8)" }}>
                {sector.label}
              </text>
            </g>
          );
        })}
        <g className="cursor-pointer" onMouseEnter={() => setHovered("center")} onMouseLeave={() => setHovered(null)} onClick={() => router.push("/about")}>
          <circle cx={CX} cy={CY} r={centerRadius} fill="rgba(20,20,20,0.42)" stroke={hovered === "center" ? "#fff" : "rgba(255,255,255,0.72)"} strokeWidth={hovered === "center" ? 4 : 2} />
          {hovered === "center" ? (
            <text x={CX} y={CY + centerRadius * 0.52} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="40" style={{ textShadow: "0 1px 2px rgba(0,0,0,.8)" }}>
              О художнице
            </text>
          ) : null}
        </g>
      </svg>

      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ width: iconBoxSize, height: iconBoxSize }}>
        <Image src="/mainpage/mainpage-icon.png" alt="JEKKI JANE ART" fill className="object-contain" />
      </div>
      </>
      ) : null}
    </section>
  );
}
