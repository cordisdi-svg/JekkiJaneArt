"use client";

import Image from "next/image";

type MobileSector = { label: string; weight: number };

const sectors: MobileSector[] = [
  { label: "Доступные картины", weight: 12.5 },
  { label: "Роспись стен и мебели", weight: 21 },
  { label: "Роспись одежды и обуви", weight: 21 },
  { label: "Картины на заказ", weight: 12.5 },
  { label: "Картины-талисманы", weight: 12.5 },
  { label: "Тату эскизы", weight: 12.5 }
];

const total = sectors.reduce((sum, sector) => sum + sector.weight, 0);

const rows = sectors.map((sector, index) => {
  const top = (sectors.slice(0, index).reduce((sum, item) => sum + item.weight, 0) / total) * 100;
  const height = (sector.weight / total) * 100;
  return { ...sector, top, height };
});

export function HomeSectorsMobile() {
  return (
    <section className="relative h-full w-full overflow-hidden lg:hidden" aria-label="Мобильные разделы">
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
          aria-label="Центральная область"
          className="absolute left-1/2 top-1/2 h-[70.710678%] w-[70.710678%] -translate-x-1/2 -translate-y-1/2 bg-transparent"
        />
      </div>
    </section>
  );
}
