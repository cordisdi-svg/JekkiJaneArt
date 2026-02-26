"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

type Sector = {
  id: number;
  lines: [string, string?];
  ariaLabel: string;
  href: string;
  imageSrc: string;
  start: number;
  end: number;
};

type Point = { x: number; y: number };
type Size = { width: number; height: number };

const sectors: Sector[] = [
  { id: 1, lines: ["Доступные", "картины"], ariaLabel: "Доступные картины", href: "/available", imageSrc: "/availablepics/(tech).JPEG", start: -140, end: -40 },
  { id: 2, lines: ["Роспись стен", "и мебели"], ariaLabel: "Роспись стен и мебели", href: "/walls", imageSrc: "/walls/1.png", start: -40, end: 0 },
  { id: 3, lines: ["Роспись одежды", "и обуви"], ariaLabel: "Роспись одежды и обуви", href: "/wear-and-shoes", imageSrc: "/wear-and-shoes/3-(tech).png", start: 0, end: 40 },
  { id: 4, lines: ["Картины-талиманы"], ariaLabel: "Картины-талиманы", href: "/amulets", imageSrc: "/amulets/1-(tech).png", start: 40, end: 140 },
  { id: 5, lines: ["Тату", "эскизы"], ariaLabel: "Тату эскизы", href: "/tattoo", imageSrc: "/tattoo/1-(tech).png", start: 140, end: 180 },
  { id: 6, lines: ["Картины на заказ"], ariaLabel: "Картины на заказ", href: "/custom-paintings", imageSrc: "/picstoorder/pic2.JPG", start: -180, end: -140 }
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
  const distance = holeRadius + Math.min(size.width, size.height) * (span >= 90 ? 0.24 : 0.18);
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
  const [hovered, setHovered] = useState<number | "center" | null>(null);

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
  const sectorMask = `radial-gradient(circle at 50% 50%, transparent 0 ${holeRadius}px, #000 ${holeRadius + 1}px)`;

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
    <section ref={hostRef} className="relative hidden h-[calc(100vh-var(--nav-height-desktop))] w-full overflow-hidden lg:block" aria-label="Главные разделы">
      {shaped.map((sector) => {
        const isDim = active !== null && active !== sector.id;
        const isHovered = hovered === sector.id;

        return (
          <button
            key={sector.id}
            type="button"
            onMouseEnter={() => setHovered(sector.id)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => trigger(sector.id, sector.href)}
            aria-label={sector.ariaLabel}
            className="absolute inset-0 border-0 bg-transparent p-0 outline-none transition-[transform,opacity,filter] duration-200 ease-out focus-visible:ring-2 focus-visible:ring-white"
            style={{
              zIndex: isHovered ? 6 : 2,
              clipPath: sector.clipPath,
              WebkitClipPath: sector.clipPath,
              maskImage: sectorMask,
              WebkitMaskImage: sectorMask,
              opacity: isDim ? 0.3 : 1,
              transform: isHovered ? "translateY(-10px) scale(1.01)" : "translateY(0) scale(1)",
              filter: isHovered ? "drop-shadow(0 10px 24px rgba(0,0,0,0.45))" : "none"
            }}
          >
            <span className="absolute inset-0 opacity-0 transition-opacity duration-300" style={{ opacity: isHovered ? 1 : 0 }}>
              <Image src={sector.imageSrc} alt="" fill className="object-cover" sizes="100vw" />
            </span>
            <span className="absolute inset-0 bg-black/30 transition-colors duration-200" style={{ backgroundColor: isHovered ? "rgba(0,0,0,0.22)" : "rgba(0,0,0,0.30)" }} />
            <span className="absolute inset-0" style={{ boxShadow: `inset 0 0 0 2px ${isHovered ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.55)"}` }} />
          </button>
        );
      })}

      <div className="pointer-events-none absolute inset-0 z-10">
        {shaped.map((sector) => (
          <div
            key={`label-${sector.id}`}
            className="absolute -translate-x-1/2 -translate-y-1/2 text-center text-[clamp(1.2rem,2.2vw,2.2rem)] font-semibold leading-[1.1] text-white"
            style={{
              left: sector.labelPos.left,
              top: sector.labelPos.top,
              maxWidth: "clamp(180px,20vw,420px)",
              textShadow: "0 2px 8px rgba(0,0,0,0.75), 0 0 2px rgba(0,0,0,0.7)",
              WebkitTextStroke: "3px rgba(0,0,0,0.65)",
              paintOrder: "stroke"
            }}
          >
            {sector.lines[0]}
            {sector.lines[1] ? <><br />{sector.lines[1]}</> : null}
          </div>
        ))}
      </div>

      <button
        type="button"
        onMouseEnter={() => setHovered("center")}
        onMouseLeave={() => setHovered(null)}
        onClick={() => trigger("center", "/about")}
        aria-label="О художнице"
        className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border-2 transition-[transform,opacity,border-color,filter] duration-200 ease-out focus-visible:ring-2 focus-visible:ring-white"
        style={{
          width: centerDiameter,
          height: centerDiameter,
          opacity: active !== null && active !== "center" ? 0.35 : 1,
          transform: hovered === "center" ? "translate(-50%,-50%) translateY(-10px) scale(1.01)" : "translate(-50%,-50%)",
          borderColor: hovered === "center" ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.72)",
          filter: hovered === "center" ? "drop-shadow(0 10px 24px rgba(0,0,0,0.45))" : "none"
        }}
      >
        <span className="absolute inset-0 bg-black/28 transition-colors duration-200" style={{ backgroundColor: hovered === "center" ? "rgba(0,0,0,0.18)" : "rgba(0,0,0,0.28)" }} />
        <div className="absolute inset-[5%]" style={{ transform: "scale(0.963)" }}>
          <Image src="/mainpage/mainpage-icon.png" alt="JEKKI JANE ART" fill className="object-contain" />
        </div>
        <span
          className="pointer-events-none absolute left-1/2 z-30 -translate-x-1/2 text-center text-[clamp(1.05rem,1.8vw,1.7rem)] font-semibold text-white transition-opacity duration-200"
          style={{
            bottom: "15%",
            opacity: hovered === "center" ? 1 : 0,
            textShadow: "0 2px 8px rgba(0,0,0,0.75), 0 0 2px rgba(0,0,0,0.7)",
            WebkitTextStroke: "2px rgba(0,0,0,0.65)",
            paintOrder: "stroke"
          }}
        >
          О художнице
        </span>
      </button>
    </section>
  );
}
