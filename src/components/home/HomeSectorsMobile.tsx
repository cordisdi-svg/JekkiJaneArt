"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLayoutEffect, useMemo, useRef, useState } from "react";

type MobileBand = { label: string; href: string; align: "left" | "center" };

const rows = [1.25, 1.25, 2.1, 2.1, 1.25, 1.25];
const rowSum = rows.reduce((a, b) => a + b, 0);

const bands: MobileBand[] = [
  { label: "Доступные картины", href: "/available", align: "center" },
  { label: "Роспись стен и мебели", href: "/walls", align: "center" },
  { label: "Роспись одежды и обуви", href: "/wear-and-shoes", align: "left" },
  { label: "Картины на заказ", href: "/custom-paintings", align: "left" },
  { label: "Картины-талиманы", href: "/amulets", align: "center" },
  { label: "Тату эскизы", href: "/tattoo", align: "center" }
];

export function HomeSectorsMobile() {
  const router = useRouter();
  const ref = useRef<HTMLDivElement | null>(null);
  const [height, setHeight] = useState(0);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const measure = () => {
      const r = el.getBoundingClientRect();
      if (r.height < 50) return;
      setHeight(r.height);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const geometry = useMemo(() => {
    if (height < 50) return null;

    const H = height;
    const D = H * 0.5;
    const r = D / 2;
    const cy = H / 2;

    const rowHeights = rows.map((value) => (value / rowSum) * H);
    const rowTops: number[] = [];
    let acc = 0;
    for (const rh of rowHeights) {
      rowTops.push(acc);
      acc += rh;
    }

    const notches = rowHeights.map((rh, i) => {
      const centerY = rowTops[i] + rh / 2;
      const dy = Math.abs(centerY - cy);
      if (dy >= r) return 12;
      const x = Math.sqrt(Math.max(0, r * r - dy * dy));
      return x + 12;
    });

    return { D, r, rowHeights, notches };
  }, [height]);

  return (
    <section
      ref={ref}
      className="relative w-full overflow-hidden lg:hidden"
      style={{ height: "calc(100svh - 17vh - env(safe-area-inset-bottom))" }}
    >
      <div
        className="grid h-full w-full"
        style={{ gridTemplateRows: "1.25fr 1.25fr 2.1fr 2.1fr 1.25fr 1.25fr" }}
      >
        {bands.map((band, i) => {
          const notch = geometry?.notches[i] ?? 12;
          return (
            <button
              key={band.href}
              type="button"
              onClick={() => router.push(band.href)}
              className={`w-full bg-white/10 pr-4 text-lg font-medium text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] transition-colors duration-300 ease-in-out hover:bg-white/20 ${
                band.align === "left" ? "text-left" : "text-center"
              }`}
              style={{
                clipPath: `polygon(${notch}px 0, 100% 0, 100% 100%, ${notch}px 100%)`,
                paddingLeft: `calc(${notch}px + 12px)`
              }}
            >
              {band.label}
            </button>
          );
        })}
      </div>

      {geometry ? (
        <button
          type="button"
          onClick={() => router.push("/about")}
          className="absolute z-10 overflow-hidden rounded-full border-2 border-white/75 bg-black/35"
          style={{
            width: `${geometry.D}px`,
            height: `${geometry.D}px`,
            left: `${-geometry.r}px`,
            top: "50%",
            transform: "translateY(-50%)",
            clipPath: "inset(0 0 0 50%)"
          }}
          aria-label="О художнице"
        >
          <Image src="/mainpage/mainpage-icon-mobile.png" alt="JEKKI JANE ART" fill className="object-contain" priority />
        </button>
      ) : null}
    </section>
  );
}
