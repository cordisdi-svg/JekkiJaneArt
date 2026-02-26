"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Sector = { id: number; label: string; href: string; clipPath: string };

const sectors: Sector[] = [
  { id: 1, label: "Роспись стен и мебели", href: "/walls", clipPath: "polygon(35% 0%, 65% 0%, 50% 50%)" },
  { id: 2, label: "Доступные картины", href: "/available", clipPath: "polygon(65% 0%, 100% 0%, 100% 50%, 50% 50%)" },
  { id: 3, label: "Роспись одежды и обуви", href: "/wear-and-shoes", clipPath: "polygon(100% 50%, 100% 100%, 65% 100%, 50% 50%)" },
  { id: 4, label: "Картины на заказ", href: "/custom-paintings", clipPath: "polygon(35% 100%, 65% 100%, 50% 50%)" },
  { id: 5, label: "Картины-талисманы", href: "/amulets", clipPath: "polygon(0% 50%, 35% 100%, 50% 50%)" },
  { id: 6, label: "Тату эскизы", href: "/tattoo", clipPath: "polygon(0% 0%, 35% 0%, 50% 50%)" }
];

export function HomeSectorsDesktop() {
  const router = useRouter();
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section className="home-active-zone relative hidden w-full lg:block">
      <div className="home-wrapper relative h-full w-full">
        {sectors.map((sector) => {
          const isHovered = hovered === sector.id;
          const isDimmed = hovered !== null && hovered !== sector.id;

          return (
            <button
              key={sector.id}
              type="button"
              className="absolute inset-0 flex items-center justify-center px-8 text-center text-2xl font-medium text-white transition-all duration-300 ease-in-out"
              style={{
                clipPath: sector.clipPath,
                backgroundColor: isHovered ? "rgba(255,255,255,0.17)" : "rgba(255,255,255,0.08)",
                transform: isHovered ? "scale(1.02)" : "scale(1)",
                filter: isDimmed ? "brightness(0.7) blur(1px)" : "none"
              }}
              onMouseEnter={() => setHovered(sector.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => router.push(sector.href)}
            >
              <span className="max-w-[32ch] drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">{sector.label}</span>
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => router.push("/about")}
          className="absolute left-1/2 top-1/2 z-10 aspect-square w-[min(50vh,50vw)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border-2 border-white/75 bg-black/35 transition-all duration-300 ease-in-out hover:scale-[1.02]"
          aria-label="О художнице"
        >
          <Image src="/mainpage/mainpage-icon.png" alt="JEKKI JANE ART" fill className="object-contain" priority />
        </button>
      </div>
    </section>
  );
}
