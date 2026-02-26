"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

type MobileBand = {
  label: string;
  href: string;
  alignment: "left" | "center";
};

const mobileBands: MobileBand[] = [
  { label: "Доступные картины", href: "/available", alignment: "center" },
  { label: "Роспись стен и мебели", href: "/walls", alignment: "center" },
  { label: "Роспись одежды и обуви", href: "/wear-and-shoes", alignment: "left" },
  { label: "Картины на заказ", href: "/custom-paintings", alignment: "left" },
  { label: "Картины-талисманы", href: "/amulets", alignment: "center" },
  { label: "Тату эскизы", href: "/tattoo", alignment: "center" }
];

export function HomeSectorsMobile() {
  const router = useRouter();

  return (
    <section className="relative h-[calc(100svh-var(--nav-h))] w-full overflow-hidden lg:hidden">
      <div className="grid h-full w-full grid-rows-[12.5%_21%_21%_12.5%_12.5%_12.5%] pl-[36vw]">
        {mobileBands.map((band) => (
          <button
            key={band.href}
            type="button"
            onClick={() => router.push(band.href)}
            className={`flex h-full w-full bg-white/10 px-4 text-white [text-shadow:0_2px_6px_rgba(0,0,0,0.8)] ${
              band.alignment === "left" ? "justify-start text-left" : "justify-center text-center"
            } items-center text-[clamp(0.95rem,4.4vw,1.5rem)]`}
          >
            <span>{band.label}</span>
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => router.push("/about")}
        className="absolute left-0 top-1/2 z-10 aspect-square w-[34vw] -translate-y-1/2 overflow-hidden rounded-full border-2 border-white/80 bg-black/30"
        aria-label="О художнице"
      >
        <Image src="/mainpage/mainpage-icon-mobile.png" alt="JEKKI JANE ART" fill className="object-contain" priority />
      </button>
    </section>
  );
}
