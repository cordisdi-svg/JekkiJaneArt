"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

type Rect = { w: number; h: number; cx: number; cy: number };
type Point = { x: number; y: number };
type Sector = { id: string; label: string; href: string; start: number; end: number };

type SectorPoly = {
  id: string;
  label: string;
  href: string;
  clipPath: string;
  labelX: number;
  labelY: number;
};

const sectors: Sector[] = [
  { id: "A", label: "Доступные картины", href: "/available", start: -140, end: -40 },
  { id: "B", label: "Роспись стен и мебели", href: "/walls", start: -40, end: 0 },
  { id: "C", label: "Роспись одежды и обуви", href: "/wear-and-shoes", start: 0, end: 40 },
  { id: "D", label: "Картины-талиманы", href: "/amulets", start: 40, end: 140 },
  { id: "E", label: "Тату эскизы", href: "/tattoo", start: 140, end: -160 },
  { id: "F", label: "Картины на заказ", href: "/custom-paintings", start: -160, end: -140 }
];

const corners = [
  { x: 0, y: 0 },
  { x: 0, y: 1 },
  { x: 1, y: 1 },
  { x: 1, y: 0 }
];

const norm = (deg: number) => {
  const n = deg % 360;
  return n < 0 ? n + 360 : n;
};

const rayHitRect = (rect: Rect, angleDeg: number): Point => {
  const rad = (angleDeg * Math.PI) / 180;
  const dx = Math.cos(rad);
  const dy = Math.sin(rad);
  const hits: { t: number; p: Point }[] = [];

  if (Math.abs(dx) > 1e-9) {
    const tL = (0 - rect.cx) / dx;
    const yL = rect.cy + tL * dy;
    if (tL > 0 && yL >= -1e-6 && yL <= rect.h + 1e-6) hits.push({ t: tL, p: { x: 0, y: Math.min(rect.h, Math.max(0, yL)) } });

    const tR = (rect.w - rect.cx) / dx;
    const yR = rect.cy + tR * dy;
    if (tR > 0 && yR >= -1e-6 && yR <= rect.h + 1e-6) hits.push({ t: tR, p: { x: rect.w, y: Math.min(rect.h, Math.max(0, yR)) } });
  }

  if (Math.abs(dy) > 1e-9) {
    const tT = (0 - rect.cy) / dy;
    const xT = rect.cx + tT * dx;
    if (tT > 0 && xT >= -1e-6 && xT <= rect.w + 1e-6) hits.push({ t: tT, p: { x: Math.min(rect.w, Math.max(0, xT)), y: 0 } });

    const tB = (rect.h - rect.cy) / dy;
    const xB = rect.cx + tB * dx;
    if (tB > 0 && xB >= -1e-6 && xB <= rect.w + 1e-6) hits.push({ t: tB, p: { x: Math.min(rect.w, Math.max(0, xB)), y: rect.h } });
  }

  if (!hits.length) return { x: rect.cx, y: rect.cy };
  hits.sort((a, b) => a.t - b.t);
  return hits[0].p;
};

const angleFromCenter = (rect: Rect, p: Point) => norm((Math.atan2(p.y - rect.cy, p.x - rect.cx) * 180) / Math.PI);

const isOnClockwiseArc = (angle: number, start: number, end: number) => {
  const s = norm(start);
  const e = norm(end);
  const a = norm(angle);
  const span = (e - s + 360) % 360;
  const delta = (a - s + 360) % 360;
  return delta > 1e-6 && delta < span - 1e-6;
};

const buildSectorPolygon = (rect: Rect, start: number, end: number): string => {
  const startHit = rayHitRect(rect, start);
  const endHit = rayHitRect(rect, end);

  const cornerPoints = corners
    .map((c) => ({ x: c.x * rect.w, y: c.y * rect.h }))
    .filter((p) => isOnClockwiseArc(angleFromCenter(rect, p), start, end))
    .sort((p1, p2) => {
      const s = norm(start);
      const d1 = (angleFromCenter(rect, p1) - s + 360) % 360;
      const d2 = (angleFromCenter(rect, p2) - s + 360) % 360;
      return d1 - d2;
    });

  const pts = [{ x: rect.cx, y: rect.cy }, startHit, ...cornerPoints, endHit];
  return `polygon(${pts.map((p) => `${p.x.toFixed(2)}px ${p.y.toFixed(2)}px`).join(", ")})`;
};

export function HomeSectorsDesktop() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [rect, setRect] = useState<Rect | null>(null);
  const [ready, setReady] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const measure = () => {
      const r = el.getBoundingClientRect();
      if (r.width < 50 || r.height < 50) {
        setReady(false);
        return;
      }
      requestAnimationFrame(() => {
        const rr = el.getBoundingClientRect();
        if (rr.width < 50 || rr.height < 50) return;
        setRect({ w: rr.width, h: rr.height, cx: rr.width / 2, cy: rr.height / 2 });
        setReady(true);
      });
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const computed = useMemo<SectorPoly[]>(() => {
    if (!rect || !ready) return [];
    return sectors.map((s) => {
      const bisector = s.start <= s.end ? (s.start + s.end) / 2 : s.start + ((s.end + 360 - s.start) % 360) / 2;
      const rad = (bisector * Math.PI) / 180;
      const labelR = Math.min(rect.w, rect.h) * 0.36;
      return {
        id: s.id,
        label: s.label,
        href: s.href,
        clipPath: buildSectorPolygon(rect, s.start, s.end),
        labelX: rect.cx + Math.cos(rad) * labelR,
        labelY: rect.cy + Math.sin(rad) * labelR
      };
    });
  }, [rect, ready]);

  return (
    <section className="home-active-zone relative hidden w-full overflow-hidden lg:block" ref={containerRef}>
      {ready && rect ? (
        <div className="home-wrapper relative h-full w-full">
          {computed.map((sector) => {
            const isHovered = hovered === sector.id;
            const dimmed = hovered !== null && hovered !== sector.id;
            return (
              <button
                key={sector.id}
                type="button"
                onClick={() => router.push(sector.href)}
                onMouseEnter={() => setHovered(sector.id)}
                onMouseLeave={() => setHovered(null)}
                className="absolute inset-0 z-[2] transition-all duration-300 ease-in-out"
                style={{
                  clipPath: sector.clipPath,
                  transform: isHovered ? "scale(1.02)" : "scale(1)",
                  filter: dimmed ? "brightness(0.7) blur(1px)" : "none",
                  background: isHovered ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.08)"
                }}
                aria-label={sector.label}
              />
            );
          })}

          {computed.map((sector) => (
            <div
              key={`${sector.id}-label`}
              className="pointer-events-none absolute z-[5] w-[30ch] max-w-[30vw] -translate-x-1/2 -translate-y-1/2 text-center text-[clamp(20px,2.1vw,40px)] font-semibold leading-tight text-white"
              style={{ left: `${sector.labelX}px`, top: `${sector.labelY}px`, textShadow: "0 2px 6px rgba(0,0,0,0.9)" }}
            >
              {sector.label}
            </div>
          ))}
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => router.push("/about")}
        className="absolute left-1/2 top-1/2 z-10 aspect-square w-[min(75vh,75vw)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border-2 border-white/75 bg-black/35 transition-transform duration-300 ease-in-out hover:scale-[1.02]"
        aria-label="О художнице"
      >
        <Image src="/mainpage/mainpage-icon.png" alt="JEKKI JANE ART" fill className="object-contain" priority />
      </button>
    </section>
  );
}
