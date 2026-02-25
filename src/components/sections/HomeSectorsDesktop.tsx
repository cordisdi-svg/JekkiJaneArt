"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type Sector = { id: number; label: string; href: string; start: number; end: number };
type Point = { x: number; y: number };

const W = 1400;
const H = 900;
const CX = W / 2;
const CY = H / 2;
const CENTER_RADIUS = 309 * 0.8;
const ICON_PADDING = 16 * 0.8;

const sectors: Sector[] = [
  { id: 1, label: "Доступные картины", href: "/available", start: -50, end: 50 },
  { id: 2, label: "Роспись стен и мебели", href: "/walls", start: 50, end: 90 },
  { id: 3, label: "Роспись одежды и обуви", href: "/wear-and-shoes", start: 90, end: 130 },
  { id: 4, label: "Картины-талиманы", href: "/amulets", start: 130, end: 230 },
  { id: 5, label: "Тату эскизы", href: "/tattoo", start: 230, end: 270 },
  { id: 6, label: "Картины на заказ", href: "/custom-paintings", start: 270, end: 310 }
];

const normalize = (angle: number) => ((angle % 360) + 360) % 360;

const pointOnRay = (angle: number, r: number): Point => {
  const rad = ((angle - 90) * Math.PI) / 180;
  return { x: CX + Math.cos(rad) * r, y: CY + Math.sin(rad) * r };
};

const angleFromCenter = (p: Point) => normalize((Math.atan2(p.y - CY, p.x - CX) * 180) / Math.PI + 90);

const rayRectIntersection = (angle: number): Point => {
  const rad = ((angle - 90) * Math.PI) / 180;
  const dx = Math.cos(rad);
  const dy = Math.sin(rad);
  const candidates: Array<Point & { t: number }> = [];

  if (Math.abs(dx) > 1e-6) {
    const tLeft = (0 - CX) / dx;
    const yLeft = CY + tLeft * dy;
    if (tLeft > 0 && yLeft >= 0 && yLeft <= H) candidates.push({ t: tLeft, x: 0, y: yLeft });

    const tRight = (W - CX) / dx;
    const yRight = CY + tRight * dy;
    if (tRight > 0 && yRight >= 0 && yRight <= H) candidates.push({ t: tRight, x: W, y: yRight });
  }

  if (Math.abs(dy) > 1e-6) {
    const tTop = (0 - CY) / dy;
    const xTop = CX + tTop * dx;
    if (tTop > 0 && xTop >= 0 && xTop <= W) candidates.push({ t: tTop, x: xTop, y: 0 });

    const tBottom = (H - CY) / dy;
    const xBottom = CX + tBottom * dx;
    if (tBottom > 0 && xBottom >= 0 && xBottom <= W) candidates.push({ t: tBottom, x: xBottom, y: H });
  }

  const closest = candidates.sort((a, b) => a.t - b.t)[0];
  return closest ? { x: closest.x, y: closest.y } : { x: CX, y: CY };
};

const cornersClockwise: Point[] = [
  { x: W, y: 0 },
  { x: W, y: H },
  { x: 0, y: H },
  { x: 0, y: 0 }
];

const withinClockwiseArc = (angle: number, start: number, end: number) => {
  const a = normalize(angle);
  const s = normalize(start);
  const e = normalize(end);
  return s <= e ? a >= s && a <= e : a >= s || a <= e;
};

const buildSectorPath = (start: number, end: number) => {
  const cStart = pointOnRay(start, CENTER_RADIUS);
  const cEnd = pointOnRay(end, CENTER_RADIUS);
  const pStart = rayRectIntersection(start);
  const pEnd = rayRectIntersection(end);
  const corners = cornersClockwise.filter((corner) => withinClockwiseArc(angleFromCenter(corner), start, end));
  const sweep = end - start >= 0 ? 1 : 0;

  return [
    `M ${cStart.x} ${cStart.y}`,
    `A ${CENTER_RADIUS} ${CENTER_RADIUS} 0 0 ${sweep} ${cEnd.x} ${cEnd.y}`,
    `L ${pEnd.x} ${pEnd.y}`,
    ...corners.map((c) => `L ${c.x} ${c.y}`),
    `L ${pStart.x} ${pStart.y}`,
    "Z"
  ].join(" ");
};

export function HomeSectorsDesktop() {
  const router = useRouter();
  const [hovered, setHovered] = useState<number | "center" | null>(null);

  const shaped = useMemo(
    () =>
      sectors.map((sector) => {
        const mid = normalize((sector.start + sector.end) / 2);
        const labelPos = pointOnRay(mid, Math.min(W, H) * 0.44);
        return { ...sector, path: buildSectorPath(sector.start, sector.end), labelPos };
      }),
    []
  );

  return (
    <section className="relative hidden h-[calc(100vh-var(--nav-height-desktop))] w-full lg:block">
      <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full">
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
          <circle cx={CX} cy={CY} r={CENTER_RADIUS} fill="rgba(20,20,20,0.42)" stroke={hovered === "center" ? "#fff" : "rgba(255,255,255,0.72)"} strokeWidth={hovered === "center" ? 4 : 2} />
          {hovered === "center" ? (
            <text x={CX} y={CY + CENTER_RADIUS * 0.52} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="40" style={{ textShadow: "0 1px 2px rgba(0,0,0,.8)" }}>
              О художнице
            </text>
          ) : null}
        </g>
      </svg>

      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ width: CENTER_RADIUS * 2 - ICON_PADDING * 2, height: CENTER_RADIUS * 2 - ICON_PADDING * 2 }}
      >
        <Image src="/mainpage/mainpage-icon.png" alt="JEKKI JANE ART" fill className="object-contain" />
      </div>
    </section>
  );
}
