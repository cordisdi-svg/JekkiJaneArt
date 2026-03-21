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

type SectorShape = Sector & {
  clipPath: string;
  labelPos: { left: string; top: string };
  points: Point[];
  boxPos: { left: string; top: string; width: string; height: string };
};

const LABEL_OFFSET: Record<number, { dx: number; dy: number }> = {
  1: { dx: 0, dy: -100 },
  2: { dx: 100, dy: 40 }, // was 80, raised by 40px
  3: { dx: 100, dy: -60 },
  4: { dx: 0, dy: 90 },
  5: { dx: -135, dy: -60 },
  6: { dx: -135, dy: 40 }
};

const DESKTOP_SECTORS: Sector[] = [
  { id: 1, lines: ["Доступные картины"], ariaLabel: "Доступные картины", href: "/available", imageSrc: "/availablepics/tech2.png", start: -148, end: -32 },
  { id: 2, lines: ["Интерьеры"], ariaLabel: "Интерьеры", href: "/walls", imageSrc: "/walls/tech.png", start: -32, end: 0 },
  { id: 3, lines: ["Роспись одежды", "и обуви"], ariaLabel: "Роспись одежды и обуви", href: "/wear-and-shoes", imageSrc: "/wear-and-shoes/tech.png", start: 0, end: 32 },
  { id: 4, lines: ["Картины-талисманы"], ariaLabel: "Картины-талисманы", href: "/amulets", imageSrc: "/amulets/1-(tech).png", start: 32, end: 148 },
  { id: 5, lines: ["Тату", "эскизы"], ariaLabel: "Тату эскизы", href: "/tattoo", imageSrc: "/tattoo/tech.png", start: 148, end: 180 },
  { id: 6, lines: ["Картины", "на заказ"], ariaLabel: "Картины на заказ", href: "/picstoorder", imageSrc: "/picstoorder/pic1(tech).JPG", start: -180, end: -148 }
];

const rectCornersClockwise = (w: number, h: number): Point[] => [
  { x: w + 20, y: -20 },
  { x: w + 20, y: h + 20 },
  { x: -20, y: h + 20 },
  { x: -20, y: -20 }
];

const normalize = (angle: number) => {
  let value = angle;
  while (value <= -180) value += 360;
  while (value > 180) value -= 360;
  return value;
};

const toMathRad = (angle: number) => (angle * Math.PI) / 180;
const toPercent = (value: number, max: number) => `${(value / max) * 100}%`;
const pointsToPath = (points: Point[]) => `M ${points.map((p) => `${p.x} ${p.y}`).join(" L ")} Z`;

const angleFromCenter = (p: Point, cx: number, cy: number) => normalize((Math.atan2(p.y - cy, p.x - cx) * 180) / Math.PI);

const isBetweenCCW = (angle: number, start: number, end: number) => {
  const span = ((end - start) % 360 + 360) % 360;
  const rel = ((angle - start) % 360 + 360) % 360;
  return rel > 0 && rel < span;
};

const rayRectIntersection = (cx: number, cy: number, w: number, h: number, angle: number): Point => {
  const rad = toMathRad(angle);
  const dx = Math.cos(rad);
  const dy = Math.sin(rad);
  const intersections: Array<{ t: number; point: Point }> = [];

  const left = -20;
  const right = w + 20;
  const top = -20;
  const bottom = h + 20;

  if (Math.abs(dx) > 1e-9) {
    const tLeft = (left - cx) / dx;
    const yLeft = cy + tLeft * dy;
    if (tLeft > 0 && yLeft >= top && yLeft <= bottom) intersections.push({ t: tLeft, point: { x: left, y: yLeft } });

    const tRight = (right - cx) / dx;
    const yRight = cy + tRight * dy;
    if (tRight > 0 && yRight >= top && yRight <= bottom) intersections.push({ t: tRight, point: { x: right, y: yRight } });
  }

  if (Math.abs(dy) > 1e-9) {
    const tTop = (top - cy) / dy;
    const xTop = cx + tTop * dx;
    if (tTop > 0 && xTop >= left && xTop <= right) intersections.push({ t: tTop, point: { x: xTop, y: top } });

    const tBottom = (bottom - cy) / dy;
    const xBottom = cx + tBottom * dx;
    if (tBottom > 0 && xBottom >= left && xBottom <= right) intersections.push({ t: tBottom, point: { x: xBottom, y: bottom } });
  }

  intersections.sort((a, b) => a.t - b.t);
  return intersections[0]?.point ?? { x: cx, y: cy };
};

const buildSectorShape = (sector: Sector, size: Size): SectorShape => {
  const { width, height } = size;
  const cx = width / 2;
  const cy = height / 2;
  const pStart = rayRectIntersection(cx, cy, width, height, sector.start);
  const pEnd = rayRectIntersection(cx, cy, width, height, sector.end);
  const corners = rectCornersClockwise(width, height).filter((corner) => isBetweenCCW(angleFromCenter(corner, cx, cy), sector.start, sector.end));
  const points = [pStart, ...corners, pEnd, { x: cx, y: cy }];
  const clipPath = `polygon(${points.map((point) => `${toPercent(point.x, width)} ${toPercent(point.y, height)}`).join(",")})`;

  const minX = Math.min(...points.map((p) => p.x));
  const maxX = Math.max(...points.map((p) => p.x));
  const minY = Math.min(...points.map((p) => p.y));
  const maxY = Math.max(...points.map((p) => p.y));

  const boxWidth = maxX - minX;
  const boxHeight = maxY - minY;
  const boxCX = minX + boxWidth / 2;
  const boxCY = minY + boxHeight / 2;

  return {
    ...sector,
    clipPath,
    points,
    labelPos: {
      left: `${(boxCX / width) * 100}%`,
      top: `${(boxCY / height) * 100}%`
    },
    boxPos: {
      left: `${(boxCX / width) * 100}%`,
      top: `${(boxCY / height) * 100}%`,
      width: `${(boxWidth / width) * 100}%`,
      height: `${(boxHeight / height) * 100}%`
    }
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

  const baseHoleRadius = Math.min(size.width, size.height) * 0.27;
  // Increase central diameter by 10%
  const centerDiameter = baseHoleRadius * 2 * 1.05 * 1.1;
  // Make the mask perfectly tight to the center circle
  const holeRadius = centerDiameter / 2;
  const sectorMask = `radial-gradient(circle at 50% 50%, transparent 0 ${holeRadius}px, #000 ${holeRadius + 1}px)`;
  const shaped = useMemo(() => DESKTOP_SECTORS.map((sector) => buildSectorShape(sector, size)), [size]);

  const trigger = (target: number | "center", href: string) => {
    if (active !== null) return;
    setActive(target);
    window.setTimeout(() => router.push(href), 1000);
  };

  return (
    <section ref={hostRef} className="relative hidden h-[calc(100vh-var(--nav-height-desktop))] w-full lg:block" aria-label="Главные разделы">
      {shaped.map((sector) => {
        const isDim = active !== null && active !== sector.id;
        const isHovered = hovered === sector.id;
        const offset = LABEL_OFFSET[sector.id] ?? { dx: 0, dy: 0 };
        const maskId = `sector-border-hole-mask-${sector.id}`;

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
              overflow: "hidden",
              opacity: isDim ? 0.3 : 1,
              transform: isHovered ? "translateY(-10px) scale(1.01)" : "translateY(0) scale(1)",
              filter: isHovered ? "drop-shadow(0 10px 24px rgba(0,0,0,0.45))" : "none"
            }}
          >
            <span
              className="absolute inset-0 pointer-events-none"
              style={{
                opacity: isHovered ? 1 : 0,
                transitionProperty: "opacity",
                transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
                transitionDuration: isHovered ? "300ms" : "3000ms"
              }}
            >
              <div
                className="absolute pointer-events-none"
                style={{
                  left: sector.boxPos.left,
                  top: sector.boxPos.top,
                  width: sector.boxPos.width,
                  height: sector.boxPos.height,
                  transform: "translate(-50%, -50%)"
                }}
              >
                <Image src={sector.imageSrc} alt="" fill className="object-cover animate-bg-scale" sizes="100vw" />
              </div>
            </span>
            <span className="absolute inset-0 bg-black/30 transition-colors duration-200" style={{ backgroundColor: isHovered ? "rgba(0,0,0,0.27)" : "rgba(0,0,0,0.35)" }} />

            <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox={`0 0 ${size.width} ${size.height}`} preserveAspectRatio="none" aria-hidden>
              <defs>
                <mask id={maskId} x="0" y="0" width={size.width} height={size.height} maskUnits="userSpaceOnUse">
                  <rect x="0" y="0" width={size.width} height={size.height} fill="white" />
                  <circle cx={size.width / 2} cy={size.height / 2} r={holeRadius} fill="black" />
                </mask>
              </defs>
              <g mask={`url(#${maskId})`}>
                <path
                  d={pointsToPath(sector.points)}
                  fill="none"
                  stroke={isHovered ? "#9c0f06" : "#444444"}
                  strokeWidth={isHovered ? 6 : 1}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
              </g>
            </svg>

            <span
              className="font-abibas pointer-events-none absolute text-center text-[clamp(1.68rem,3.08vw,3.08rem)] font-semibold leading-[1.1] text-[#e5e5e5]"
              style={{
                left: sector.labelPos.left,
                top: sector.labelPos.top,
                transform: `translate(-50%, -50%) translate(${offset.dx}px, ${offset.dy}px)`,
                maxWidth: "80%",
                textWrap: "balance",
                textShadow: "0 2px 12px rgba(156,15,6,0.85), 0 0 6px rgba(156,15,6,0.9)",
                WebkitTextStroke: "3px rgba(60,5,5,0.85)",
                paintOrder: "stroke",
                zIndex: 3
              }}
            >
              {sector.lines[0]}
              {sector.lines[1] ? <><br />{sector.lines[1]}</> : null}
            </span>
          </button>
        );
      })}

      <button
        type="button"
        onMouseEnter={() => setHovered("center")}
        onMouseLeave={() => setHovered(null)}
        onClick={() => trigger("center", "/about")}
        aria-label="О художнице"
        className="absolute left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2 border-0 bg-transparent p-0 outline-none transition-[transform,opacity,filter] duration-200 ease-out focus-visible:ring-2 focus-visible:ring-white"
        style={{
          width: centerDiameter,
          height: centerDiameter,
          overflow: "visible",
          opacity: active !== null && active !== "center" ? 0.35 : 1,
          transform: hovered === "center" ? "translate(-50%,-50%) translateY(-10px) scale(1.01)" : "translate(-50%,-50%)",
          filter: hovered === "center" ? "drop-shadow(0 10px 24px rgba(0,0,0,0.45))" : "none"
        }}
      >
        <span className="absolute inset-0 rounded-full bg-black/28 transition-colors duration-200" style={{ backgroundColor: hovered === "center" ? "rgba(0,0,0,0.28)" : "rgba(0,0,0,0.38)", zIndex: 1 }} />
        <span className="absolute inset-0 pointer-events-none rounded-full transition-all duration-200" style={{ boxShadow: `inset 0 0 0 ${hovered === "center" ? 6 : 1.5}px ${hovered === "center" ? "#9c0f06" : "#444444"}`, zIndex: 2 }} />
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 5, transform: "scale(1.595)", overflow: "visible" }}>
          <Image src="/mainpage/mainpage-icon.png" alt="JEKKI JANE ART" fill className="object-contain" />
        </div>
        <span
          className="font-abibas pointer-events-none absolute left-1/2 -translate-x-1/2 text-center text-[clamp(1.26rem,2.16vw,2.04rem)] font-semibold text-[#e5e5e5] transition-opacity duration-200"
          style={{
            bottom: "10%",
            zIndex: 6,
            opacity: hovered === "center" ? 1 : 0,
            textShadow: "0 2px 12px rgba(156,15,6,0.85), 0 0 6px rgba(156,15,6,0.9)",
            WebkitTextStroke: "2px rgba(60,5,5,0.85)",
            paintOrder: "stroke"
          }}
        >
          О художнице
        </span>
      </button>
    </section>
  );
}
