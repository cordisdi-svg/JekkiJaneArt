"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

type Sector = {
  id: number;
  label: string;
  href: string;
  start: number;
  end: number;
};

type Point = { x: number; y: number };

type Size = { width: number; height: number };

const sectors: Sector[] = [
  { id: 1, label: "Доступные картины", href: "/available", start: -140, end: -40 },
  { id: 2, label: "Роспись стен и мебели", href: "/walls", start: -40, end: 0 },
  { id: 3, label: "Роспись одежды и обуви", href: "/wear-and-shoes", start: 0, end: 40 },
  { id: 4, label: "Картины-талисманы", href: "/amulets", start: 40, end: 140 },
  { id: 5, label: "Тату эскизы", href: "/tattoo", start: 140, end: 180 },
  { id: 6, label: "Картины на заказ", href: "/custom-paintings", start: -180, end: -140 }
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
  const corners = rectCornersClockwise(width, height).filter((corner) => {
    const angle = angleFromCenter(corner, cx, cy);
    return isBetweenCCW(angle, sector.start, sector.end);
  });

  return `polygon(${[pStart, ...corners, pEnd, { x: cx, y: cy }].map((point) => pointToClip(point, width, height)).join(",")})`;
};

const labelPosition = (sector: Sector, size: Size, holeRadius: number) => {
  const mid = normalize(sector.start + (((sector.end - sector.start) % 360) + 360) / 2);
  const span = ((sector.end - sector.start) % 360 + 360) % 360;
  const long = span >= 90;
  const distance = long ? holeRadius + Math.min(size.width, size.height) * 0.22 : holeRadius + Math.min(size.width, size.height) * 0.15;
  const rad = toMathRad(mid);
  const x = size.width / 2 + Math.cos(rad) * distance;
  const y = size.height / 2 + Math.sin(rad) * distance;

  return {
    left: `${(x / size.width) * 100}%`,
    top: `${(y / size.height) * 100}%`
  };
};

export function HomeSectorsDesktop() {
  const router = useRouter();
  const hostRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<Size>({ width: 1200, height: 800 });
  const [active, setActive] = useState<number | "center" | null>(null);

  useEffect(() => {
    const element = hostRef.current;
    if (!element) return;

    const update = () => {
      setSize({ width: element.clientWidth, height: element.clientHeight });
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const holeRadius = Math.min(size.width, size.height) * 0.25;
  const centerDiameter = holeRadius * 2;
  const cutoutMask = `radial-gradient(circle at 50% 50%, transparent 0 ${holeRadius}px, #000 ${holeRadius + 1}px)`;

  const shaped = useMemo(
    () =>
      sectors.map((sector) => ({
        ...sector,
        clipPath: polygonForSector(sector, size),
        labelPos: labelPosition(sector, size, holeRadius)
      })),
    [holeRadius, size]
  );

  const handleTap = (target: number | "center", href: string) => {
    if (active !== null) return;
    setActive(target);
    window.setTimeout(() => router.push(href), 1000);
  };

  return (
    <section ref={hostRef} className="relative hidden h-full w-full overflow-hidden lg:block" aria-label="Главные разделы">
      {shaped.map((sector) => {
        const isActive = active === sector.id;
        const isDim = active !== null && active !== sector.id;

        return (
          <button
            key={sector.id}
            type="button"
            onClick={() => handleTap(sector.id, sector.href)}
            aria-label={sector.label}
            className="absolute inset-0 border-0 bg-transparent p-0 text-white outline-none transition-all duration-300 ease-out focus-visible:ring-2 focus-visible:ring-white"
            style={{
              clipPath: sector.clipPath,
              WebkitClipPath: sector.clipPath,
              maskImage: cutoutMask,
              WebkitMaskImage: cutoutMask,
              background: isActive ? "rgba(255,255,255,0.24)" : "rgba(255,255,255,0.08)",
              opacity: isDim ? 0.28 : 1
            }}
          >
            <span
              className="absolute -translate-x-1/2 -translate-y-1/2 text-center text-3xl font-medium leading-tight drop-shadow-[0_2px_3px_rgba(0,0,0,0.75)]"
              style={{ left: sector.labelPos.left, top: sector.labelPos.top, maxWidth: "28vw" }}
            >
              {sector.label}
            </span>
          </button>
        );
      })}

      <button
        type="button"
        onClick={() => handleTap("center", "/about")}
        aria-label="О художнице"
        className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/70 bg-black/35 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-white"
        style={{
          width: centerDiameter,
          height: centerDiameter,
          opacity: active !== null && active !== "center" ? 0.35 : 1
        }}
      />

      <div className="pointer-events-none absolute left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full" style={{ width: centerDiameter, height: centerDiameter }}>
        <Image src="/mainpage/mainpage-icon.png" alt="JEKKI JANE ART" fill className="object-cover" />
      </div>
    </section>
  );
}
