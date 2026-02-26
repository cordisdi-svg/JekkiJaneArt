"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

type MobileBand = { label: string; href: string; align: "left" | "center" };

const bands: MobileBand[] = [
  { label: "Доступные картины", href: "/available", align: "center" },
  { label: "Роспись стен и мебели", href: "/walls", align: "center" },
  { label: "Роспись одежды и обуви", href: "/wear-and-shoes", align: "left" },
  { label: "Картины на заказ", href: "/custom-paintings", align: "left" },
  { label: "Картины-талисманы", href: "/amulets", align: "center" },
  { label: "Тату эскизы", href: "/tattoo", align: "center" }
];

export function HomeSectorsMobile() {
  const router = useRouter();

  return (
    <section className="home-active-zone relative w-full overflow-hidden lg:hidden">
      <div
        className="grid h-full w-full"
        style={{
          gridTemplateRows: "12.5% 21% 21% 12.5% 12.5% 12.5%"
        }}
      >
        {bands.map((band) => (
          <button
            key={band.href}
            type="button"
            onClick={() => router.push(band.href)}
            className={`w-full border-white/20 bg-white/10 pl-[var(--home-circle-mobile-size)] pr-4 text-lg font-medium text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] transition-all duration-300 ease-in-out hover:bg-white/20 ${
              band.align === "left" ? "text-left" : "text-center"
            }`}
          >
            {band.label}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => router.push("/about")}
        className="absolute left-0 top-1/2 z-10 aspect-square w-[var(--home-circle-mobile-size)] -translate-y-1/2 overflow-hidden rounded-full border-2 border-white/75 bg-black/30"
        aria-label="О художнице"
      >
        <Image src="/mainpage/mainpage-icon-mobile.png" alt="JEKKI JANE ART" fill className="object-contain" priority />
      </button>
    </section>
  );
}
