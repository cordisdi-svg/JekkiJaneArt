"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

type DesktopSector = {
  id: number;
  label: string;
  href: string;
  clipPath: string;
  textClassName?: string;
};

const desktopSectors: DesktopSector[] = [
  {
    id: 1,
    label: "Доступные картины",
    href: "/available",
    clipPath: "polygon(37% 0%, 63% 0%, 50% 50%)"
  },
  {
    id: 2,
    label: "Роспись стен и мебели",
    href: "/walls",
    clipPath: "polygon(63% 0%, 100% 0%, 100% 52%, 50% 50%)",
    textClassName: "pl-[16vw]"
  },
  {
    id: 3,
    label: "Роспись одежды и обуви",
    href: "/wear-and-shoes",
    clipPath: "polygon(100% 52%, 100% 100%, 63% 100%, 50% 50%)",
    textClassName: "pl-[15vw]"
  },
  {
    id: 4,
    label: "Картины-талисманы",
    href: "/amulets",
    clipPath: "polygon(37% 100%, 63% 100%, 50% 50%)"
  },
  {
    id: 5,
    label: "Тату эскизы",
    href: "/tattoo",
    clipPath: "polygon(0% 52%, 37% 100%, 50% 50%)",
    textClassName: "pr-[15vw]"
  },
  {
    id: 6,
    label: "Картины на заказ",
    href: "/custom-paintings",
    clipPath: "polygon(0% 0%, 37% 0%, 50% 50%, 0% 52%)",
    textClassName: "pr-[16vw]"
  }
];

export function HomeSectorsDesktop() {
  const router = useRouter();
  const [hoveredSectorId, setHoveredSectorId] = useState<number | "center" | null>(null);

  return (
    <section className="relative hidden h-[calc(100svh-var(--nav-h))] w-full overflow-hidden lg:block">
      <div className="relative h-full w-full overflow-hidden">
        {desktopSectors.map((sector) => {
          const isHovered = hoveredSectorId === sector.id;
          const isDimmed = hoveredSectorId !== null && hoveredSectorId !== sector.id;

          return (
            <button
              key={sector.id}
              type="button"
              onClick={() => router.push(sector.href)}
              onMouseEnter={() => setHoveredSectorId(sector.id)}
              onMouseLeave={() => setHoveredSectorId(null)}
              className="absolute inset-0 flex h-full w-full items-center justify-center bg-white/10 px-[8vw] text-center text-[clamp(1.2rem,2.6vw,2.5rem)] font-medium text-white [text-shadow:0_2px_6px_rgba(0,0,0,0.8)] transition duration-300 ease-out"
              style={{
                clipPath: sector.clipPath,
                transform: isHovered ? "scale(1.02)" : "scale(1)",
                filter: isDimmed ? "brightness(0.7) blur(1px)" : "none"
              }}
            >
              <span className={sector.textClassName}>{sector.label}</span>
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => router.push("/about")}
          onMouseEnter={() => setHoveredSectorId("center")}
          onMouseLeave={() => setHoveredSectorId(null)}
          className="absolute left-1/2 top-1/2 z-[5] aspect-square w-[min(67.5vh,67.5vw)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border-2 border-white/75 bg-black/30"
          aria-label="О художнице"
          style={{
            filter: hoveredSectorId !== null && hoveredSectorId !== "center" ? "brightness(0.7) blur(1px)" : "none",
            transform: `translate(-50%, -50%) ${hoveredSectorId === "center" ? "scale(1.02)" : "scale(1)"}`
          }}
        >
          <Image src="/mainpage/mainpage-icon.png" alt="JEKKI JANE ART" fill className="object-contain" priority />
        </button>
      </div>
    </section>
  );
}
