"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

const MOBILE_SECTORS = [
  { id: 1, label: "Доступные картины", href: "/available", imageSrc: "/availablepics/tech2.png", heightPercent: 14, align: "center" as const },
  { id: 2, label: "Картины на заказ", href: "/picstoorder", imageSrc: "/picstoorder/pic1(tech).JPG", heightPercent: 14, align: "center" as const },
  { id: 3, label: "Картины амулеты", href: "/amulets", imageSrc: "/amulets/1-(tech).png", heightPercent: 22, align: "right-half" as const },
  { id: 4, label: "Интерьеры", href: "/walls", imageSrc: "/walls/tech.png", heightPercent: 22, align: "right-half" as const },
  { id: 5, label: "Одежда и обувь", href: "/wear-and-shoes", imageSrc: "/wear-and-shoes/tech.png", heightPercent: 14, align: "center" as const },
  { id: 6, label: "Тату эскизы", href: "/tattoo", imageSrc: "/tattoo/tech.png", heightPercent: 14, align: "center" as const }
];

export function HomeSectorsMobile() {
  const router = useRouter();
  const [active, setActive] = useState<number | null>(null);

  const handleNavigate = (targetHref: string, id: number) => {
    setActive(id);
    setTimeout(() => {
      router.push(targetHref);
    }, 500); // Small delay to show active state
  };

  return (
    <section className="relative h-full w-full overflow-hidden bg-black lg:hidden" aria-label="Мобильные разделы">
      {/* Container for the sectors. */}
      <div className="flex h-full w-full flex-col">
        {MOBILE_SECTORS.map((sector, index) => {
          const isNotLast = index !== MOBILE_SECTORS.length - 1;
          const isActive = active === sector.id;

          return (
            <button
              key={sector.id}
              onClick={() => handleNavigate(sector.href, sector.id)}
              className="group relative flex w-full flex-shrink-0 items-center overflow-hidden border-orange-200/5 transition-opacity"
              style={{
                height: `${sector.heightPercent}%`,
                borderBottomWidth: isNotLast ? "1px" : "0",
                borderBottomColor: "#444444",
                opacity: active !== null && !isActive ? 0.3 : 1
              }}
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <Image src={sector.imageSrc} alt="" fill className="object-cover blur-[1px] animate-bg-scale" sizes="100vw" />
              </div>

              {/* Overlay for darkening the background */}
              <div className="absolute inset-0 bg-black/[0.45] transition-colors group-active:bg-black/[0.65]" />

              <div className={`relative z-10 px-4 ${sector.align === 'center' ? 'w-full text-center' : 'w-[41%] ml-auto text-center'}`}>
                <span className="font-abibas text-[clamp(1.38rem,6.21vw,1.79rem)] font-semibold uppercase tracking-wider text-[#e5e5e5] whitespace-pre-line" style={{
                  textShadow: "0 2px 6px rgba(90,0,0,0.95), 0 0 4px rgba(90,0,0,1)",
                  WebkitTextStroke: "1px rgba(60,5,5,0.6)",
                  paintOrder: "stroke"
                }}>
                  {sector.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Central absolute mobile icon, strictly rectangular with no circle cropping */}
      <div
        className="absolute left-0 top-1/2 z-20 flex items-center justify-start pointer-events-none -translate-y-1/2"
        style={{ width: '63%', height: '63%' }}
      >
        <button
          onClick={() => {
            setActive(0);
            setTimeout(() => router.push("/about"), 500);
          }}
          className="relative pointer-events-auto overflow-hidden transition-transform active:scale-95 flex items-center justify-center w-full h-full"
          style={{
            opacity: active !== null && active !== 0 ? 0.3 : 1
          }}
          aria-label="О художнице"
        >
          {/* Main Icon scaled naturally to fit the new area, shifted to stay left-aligned, and brightened */}
          <Image
            src="/mainpage/mainpage-icon-mobile.png"
            alt="О художнице"
            fill
            className="object-contain object-left"
            style={{ filter: 'brightness(1.15)' }}
            sizes="63vw"
          />
        </button>
      </div>
    </section>
  );
}
