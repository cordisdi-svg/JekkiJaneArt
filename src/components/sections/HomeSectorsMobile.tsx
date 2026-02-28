"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

type MobileSector = { label: string; weight: number; href: string };

const sectors: MobileSector[] = [
  { label: "Доступные картины", weight: 12.5, href: "/available" },
  { label: "Роспись стен и мебели", weight: 21, href: "/walls" },
  { label: "Роспись одежды и обуви", weight: 21, href: "/wear-and-shoes" },
  { label: "Картины на заказ", weight: 12.5, href: "/custom-paintings" },
  { label: "Картины-талисманы", weight: 12.5, href: "/amulets" },
  { label: "Тату эскизы", weight: 12.5, href: "/tattoo" }
];

const total = sectors.reduce((sum, sector) => sum + sector.weight, 0);

const rows = sectors.map((sector, index) => {
  const top = (sectors.slice(0, index).reduce((sum, item) => sum + item.weight, 0) / total) * 100;
  const height = (sector.weight / total) * 100;
  return { ...sector, top, height };
});

export function HomeSectorsMobile() {
  const router = useRouter();
  const [active, setActive] = useState<number | "center" | null>(null);

  const trigger = (target: number | "center", href: string) => {
    if (active !== null) return;
    setActive(target);
    window.setTimeout(() => router.push(href), 1000);
  };

  return (
    <section className="relative h-full w-full overflow-hidden lg:hidden" aria-label="Мобильные разделы">
      {rows.map((row, index) => {
        const isDim = active !== null && active !== index;

        return (
          <button
            key={row.label}
            type="button"
            onClick={() => trigger(index, row.href)}
            aria-label={row.label}
            className="absolute left-0 w-full border-0 bg-black/15 p-0 transition-opacity duration-200"
            style={{ top: `${row.top}%`, height: `${row.height}%`, opacity: isDim ? 0.3 : 1 }}
          />
        );
      })}

      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
        <defs>
          <mask id="mobile-sectors-cutout">
            <rect x="0" y="0" width="100" height="100" fill="white" />
            <circle cx="25" cy="50" r="25" fill="black" />
          </mask>
        </defs>

        <g mask="url(#mobile-sectors-cutout)">
          {rows.map((row, index) => (
            <g key={row.label}>
              <rect x="0" y={row.top} width="100" height={row.height} fill="transparent" stroke="#000" strokeWidth="2" />
              <text
                x={index === 2 || index === 3 ? 75 : 50}
                y={row.top + row.height / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="white"
                stroke="rgba(0,0,0,0.7)"
                strokeWidth="0.7"
                paintOrder="stroke"
                fontSize="4.8"
              >
                {row.label}
              </text>
            </g>
          ))}
        </g>
      </svg>

      <div className="pointer-events-none absolute left-0 top-1/2 z-20 h-1/2 w-[50vw] -translate-y-1/2 rounded-full relative">
        <Image src="/mainpage/mainpage-icon-mobile.png" alt="JEKKI JANE ART" fill className="object-contain" />
      </div>

      <div className="absolute left-0 top-1/2 z-30 h-1/2 w-[50vw] -translate-y-1/2">
        <button
          type="button"
          onClick={() => trigger("center", "/about")}
          aria-label="О художнице"
          className="absolute left-1/2 top-1/2 h-[70.710678%] w-[70.710678%] -translate-x-1/2 -translate-y-1/2 bg-transparent"
          style={{ opacity: active !== null && active !== "center" ? 0.3 : 1 }}
        />
      </div>
    </section>
  );
}
