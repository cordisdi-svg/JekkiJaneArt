"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

type Sector = { id: number; label: React.ReactNode; ariaLabel: string; href: string; start: number; end: number };
type Point = { x: number; y: number };
type Size = { width: number; height: number };

const sectors: Sector[] = [
  { id: 1, label: <>Доступные<br />картины</>, ariaLabel: "Доступные картины", href: "/available", start: -140, end: -40 },
  { id: 2, label: <>Роспись стен<br />и мебели</>, ariaLabel: "Роспись стен и мебели", href: "/walls", start: -40, end: 0 },
  { id: 3, label: <>Роспись одежды<br />и обуви</>, ariaLabel: "Роспись одежды и обуви", href: "/wear-and-shoes", start: 0, end: 40 },
  { id: 4, label: <>Картины-<br />талисманы</>, ariaLabel: "Картины-талисманы", href: "/amulets", start: 40, end: 140 },
  { id: 5, label: <>Тату<br />эскизы</>, ariaLabel: "Тату эскизы", href: "/tattoo", start: 140, end: 180 },
  { id: 6, label: <>Картины<br />на заказ</>, ariaLabel: "Картины на заказ", href: "/custom-paintings", start: -180, end: -140 }
];

const rectCornersClockwise = (w: number, h: number): Point[] => [
  { x: w, y: 0 },
  { x: w, y: h },
  { x: 0, y: h },
  { x: 0, y: 0 }
];

const normalize = (angle: number) => {
  let value = angle;
  while (value <= -180) value += 360;
  while (value > 180) value -= 360;
  return value;
};

const toMathRad = (angle: number) => (angle * Math.PI) / 180;

const angleFromCenter = (p: Point, cx: number, cy: number) => normalize((Math.atan2(p.y - cy, p.x - cx) * 180) / Math.PI);

const isBetweenCCW = (angle: number, start: number, end: number) => {
  const span = ((end - start) % 360 + 360) % 360;
  const rel = ((angle - start) % 360 + 360) % 360;
  return rel > 0 && rel < span;
};

const rayRectIntersection = (cx: number, cy: number, width: number, height: number, angle: number): Point => {
  const rad = toMathRad(angle);
  const dx = Math.cos(rad);
  const dy = Math.sin(rad);
  const intersections: Array<{ t: number; point: Point }> = [];

  if (Math.abs(dx) > 1e-9) {
    const tLeft = (0 - cx) / dx;
    const yLeft = cy + tLeft * dy;
    if (tLeft > 0 && yLeft >= 0 && yLeft <= height) intersections.push({ t: tLeft, point: { x: 0, y: yLeft } });

    const tRight = (width - cx) / dx;
    const yRight = cy + tRight * dy;
    if (tRight > 0 && yRight >= 0 && yRight <= height) intersections.push({ t: tRight, point: { x: width, y: yRight } });
  }

  if (Math.abs(dy) > 1e-9) {
    const tTop = (0 - cy) / dy;
    const xTop = cx + tTop * dx;
    if (tTop > 0 && xTop >= 0 && xTop <= width) intersections.push({ t: tTop, point: { x: xTop, y: 0 } });

    const tBottom = (height - cy) / dy;
    const xBottom = cx + tBottom * dx;
    if (tBottom > 0 && xBottom >= 0 && xBottom <= width) intersections.push({ t: tBottom, point: { x: xBottom, y: height } });
  }

  intersections.sort((a, b) => a.t - b.t);
  return intersections[0]?.point ?? { x: cx, y: cy };
};

const toPercent = (value: number, max: number) => `${(value / max) * 100}%`;

const pointToClip = (p: Point, w: number, h: number) => `${toPercent(p.x, w)} ${toPercent(p.y, h)}`;

const polygonForSector = (sector: Sector, size: Size) => {
  const { width, height } = size;
  const cx = width / 2;
  const cy = height / 2;
  const pStart = rayRectIntersection(cx, cy, width, height, sector.start);
  const pEnd = rayRectIntersection(cx, cy, width, height, sector.end);
  const corners = rectCornersClockwise(width, height).filter((corner) => isBetweenCCW(angleFromCenter(corner, cx, cy), sector.start, sector.end));
  return `polygon(${[pStart, ...corners, pEnd, { x: cx, y: cy }].map((point) => pointToClip(point, width, height)).join(",")})`;
};

const labelPosition = (sector: Sector, size: Size, holeRadius: number) => {
  const mid = normalize(sector.start + (((sector.end - sector.start) % 360) + 360) / 2);
  const span = ((sector.end - sector.start) % 360 + 360) % 360;
  const distance = holeRadius + Math.min(size.width, size.height) * (span >= 90 ? 0.25 : 0.17);
  const rad = toMathRad(mid);
  return {
    left: `${((size.width / 2 + Math.cos(rad) * distance) / size.width) * 100}%`,
    top: `${((size.height / 2 + Math.sin(rad) * distance) / size.height) * 100}%`
  };
};

export function HomeSectorsDesktop() {
  const router = useRouter();
  const hostRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<Size>({ width: 1280, height: 720 });
  const [active, setActive] = useState<number | "center" | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    const element = hostRef.current;
    if (!element) return;
    const update = () => setSize({ width: Math.max(element.clientWidth, 1), height: Math.max(element.clientHeight, 1) });
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const holeRadius = Math.min(size.width, size.height) * 0.27;
  const centerDiameter = holeRadius * 2;
  const cutoutMask = `radial-gradient(circle at 50% 50%, transparent 0 ${holeRadius}px, #000 ${holeRadius + 1}px)`;

  const shaped = useMemo(
    () => sectors.map((sector) => ({ ...sector, clipPath: polygonForSector(sector, size), labelPos: labelPosition(sector, size, holeRadius) })),
    [holeRadius, size]
  );

  const trigger = (target: number | "center", href: string) => {
    if (active !== null) return;
    setActive(target);
    window.setTimeout(() => router.push(href), 1000);
  };

  return (
    <section ref={hostRef} className="relative hidden h-[calc(100svh-var(--nav-height-desktop))] w-full overflow-hidden lg:block" aria-label="Главные разделы">
      {shaped.map((sector) => {
        const isActive = active === sector.id;
        const isDim = active !== null && active !== sector.id;
        const isHovered = hovered === sector.id;
        const zIndex = isHovered ? 5 : 1;

        return (
          <button
            key={sector.id}
            type="button"
            onMouseEnter={() => setHovered(sector.id)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => trigger(sector.id, sector.href)}
            aria-label={sector.ariaLabel}
            className="absolute inset-0 border-0 bg-transparent p-0 text-white outline-none transition-all duration-200 ease-out focus-visible:ring-2 focus-visible:ring-white"
            style={{
              zIndex,
              clipPath: sector.clipPath,
              WebkitClipPath: sector.clipPath,
              maskImage: cutoutMask,
              WebkitMaskImage: cutoutMask,
              backgroundColor: isHovered || isActive ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.10)",
              opacity: isDim ? 0.28 : 1,
              transform: isHovered ? "translateY(-10px) scale(1.01)" : "translateY(0) scale(1)",
              filter: isHovered ? "drop-shadow(0 10px 24px rgba(0,0,0,0.45))" : "none"
            }}
          >
            <span
              className="pointer-events-none absolute inset-0"
              style={{ clipPath: sector.clipPath, WebkitClipPath: sector.clipPath, boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.55)" }}
            />
            <span
              className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 text-center text-3xl font-medium leading-[1.1] drop-shadow-[0_2px_3px_rgba(0,0,0,0.75)]"
              style={{ left: sector.labelPos.left, top: sector.labelPos.top, maxWidth: "clamp(180px,20vw,420px)", whiteSpace: "normal" }}
            >
              {sector.label}
            </span>
          </button>
        );
      })}

      <button
        type="button"
        onClick={() => trigger("center", "/about")}
        aria-label="О художнице"
        className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border-2 border-white/70 bg-black/35 transition-opacity duration-200 focus-visible:ring-2 focus-visible:ring-white"
        style={{ width: centerDiameter, height: centerDiameter, opacity: active !== null && active !== "center" ? 0.35 : 1 }}
      >
        <Image src="/mainpage/mainpage-icon.png" alt="JEKKI JANE ART" fill className="object-cover" />
      </button>
    </section>
  );
}
