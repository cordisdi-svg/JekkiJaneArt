"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react"; 

import { useElementSize } from "@/hooks/useElementSize";

type Sector = { id: number; label: string; href: string; start: number; end: number };
type Point = { x: number; y: number };

const ICON_PADDING = 8;

const sectors: Sector[] = [
  { id: 1, label: "Доступные картины", href: "/available", start: -30, end: 50 },
  { id: 2, label: "Роспись стен и мебели", href: "/walls", start: 50, end: 90 },
  { id: 3, label: "Роспись одежды и обуви", href: "/wear-and-shoes", start: 90, end: 150 },
  { id: 4, label: "Картины-талиманы", href: "/amulets", start: 150, end: 230 },
  { id: 5, label: "Тату эскизы", href: "/tattoo", start: 230, end: 270 },
  { id: 6, label: "Картины на заказ", href: "/custom-paintings", start: 270, end: 330 }
];

const normalize = (angle: number) => ((angle % 360) + 360) % 360;

const withinClockwiseArc = (angle: number, start: number, end: number) => {
  const a = normalize(angle);
  const s = normalize(start);
  const e = normalize(end);
  return s <= e ? a >= s && a <= e : a >= s || a <= e;
};

const pointOnRay = (angle: number, r: number, cx: number, cy: number): Point => {
  const rad = ((angle - 90) * Math.PI) / 180;
  return { x: cx + Math.cos(rad) * r, y: cy + Math.sin(rad) * r };
};

const angleFromCenter = (p: Point, cx: number, cy: number) => normalize((Math.atan2(p.y - cy, p.x - cx) * 180) / Math.PI + 90);

const rayRectIntersection = (angle: number, cx: number, cy: number, width: number, height: number): Point => {
  const rad = ((angle - 90) * Math.PI) / 180;
  const dx = Math.cos(rad);
  const dy = Math.sin(rad);
  const candidates: Array<Point & { t: number }> = [];

  if (Math.abs(dx) > 1e-6) {
    const tLeft = (0 - cx) / dx;
    const yLeft = cy + tLeft * dy;
    if (tLeft > 0 && yLeft >= 0 && yLeft <= height) candidates.push({ x: 0, y: yLeft, t: tLeft });

    const tRight = (width - cx) / dx;
    const yRight = cy + tRight * dy;
    if (tRight > 0 && yRight >= 0 && yRight <= height) candidates.push({ x: width, y: yRight, t: tRight });
  }

  if (Math.abs(dy) > 1e-6) {
    const tTop = (0 - cy) / dy;
    const xTop = cx + tTop * dx;
    if (tTop > 0 && xTop >= 0 && xTop <= width) candidates.push({ x: xTop, y: 0, t: tTop });

    const tBottom = (height - cy) / dy;
    const xBottom = cx + tBottom * dx;
    if (tBottom > 0 && xBottom >= 0 && xBottom <= width) candidates.push({ x: xBottom, y: height, t: tBottom });
  }

  const nearest = candidates.sort((a, b) => a.t - b.t)[0];
  return nearest ? { x: nearest.x, y: nearest.y } : { x: cx, y: cy };
};

const buildSectorPath = (start: number, end: number, radius: number, cx: number, cy: number, width: number, height: number) => {
  const cStart = pointOnRay(start, radius, cx, cy);
  const cEnd = pointOnRay(end, radius, cx, cy);
  const pStart = rayRectIntersection(start, cx, cy, width, height);
  const pEnd = rayRectIntersection(end, cx, cy, width, height);

  const cornersClockwise: Point[] = [
    { x: width, y: 0 },
    { x: width, y: height },
    { x: 0, y: height },
    { x: 0, y: 0 }
  ];

  const corners = cornersClockwise.filter((corner) => withinClockwiseArc(angleFromCenter(corner, cx, cy), start, end));
  const sweep = end - start >= 0 ? 1 : 0;

  return [
    `M ${cStart.x} ${cStart.y}`,
    `A ${radius} ${radius} 0 0 ${sweep} ${cEnd.x} ${cEnd.y}`,
    `L ${pEnd.x} ${pEnd.y}`,
    ...corners.map((c) => `L ${c.x} ${c.y}`),
    `L ${pStart.x} ${pStart.y}`,
    "Z"
  ].join(" ");
};

export function HomeSectorsDesktop() {
  const router = useRouter();
  const { ref, width, height } = useElementSize();
  const [hovered, setHovered] = useState<number | "center" | null>(null);

  const cx = width / 2;
  const cy = height / 2;
  const centerRadius = Math.min(width, height) * 0.22 * 0.8;

  const shaped = useMemo(() => {
    if (!width || !height) return [];

    return sectors.map((sector) => {
      const mid = normalize((sector.start + sector.end) / 2);
      const labelPos = pointOnRay(mid, Math.min(width, height) * 0.44, cx, cy);
      return {
        ...sector,
        path: buildSectorPath(sector.start, sector.end, centerRadius, cx, cy, width, height),
        labelPos
      };
    });
  }, [centerRadius, cx, cy, height, width]);

  return (
    <section ref={ref} className="relative hidden h-[calc(100vh-var(--nav-height-desktop))] w-full lg:block">
      {!width || !height ? null : (
        <>
          <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
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
              <circle cx={cx} cy={cy} r={centerRadius} fill="rgba(20,20,20,0.42)" stroke={hovered === "center" ? "#fff" : "rgba(255,255,255,0.72)"} strokeWidth={hovered === "center" ? 4 : 2} />
              {hovered === "center" ? (
                <text x={cx} y={cy + centerRadius * 0.52} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="40" style={{ textShadow: "0 1px 2px rgba(0,0,0,.8)" }}>
                  О художнице
                </text>
              ) : null}
            </g>
          </svg>

          <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ width: centerRadius * 2 - ICON_PADDING, height: centerRadius * 2 - ICON_PADDING }}>
            <Image src="/mainpage/mainpage-icon.png" alt="JEKKI JANE ART" fill className="object-contain" />
          </div>
        </>
      )}
    </section>
  );
}
