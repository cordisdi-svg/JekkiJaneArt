"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

const MOBILE_SECTORS = [
  { id: 1, label: "Доступные картины", href: "/available", imageSrc: "/availablepics/tech2.png", heightPercent: 14, align: "center" as const },
  { id: 2, label: "Картины на заказ", href: "/picstoorder", imageSrc: "/picstoorder/pic1(tech).JPG", heightPercent: 14, align: "center" as const },
  { id: 3, label: "Картины-амулеты", href: "/amulets", imageSrc: "/amulets/1-(tech).png", heightPercent: 22, align: "right-half" as const },
  { id: 4, label: "Стены и мебель", href: "/walls", imageSrc: "/walls/tech.png", heightPercent: 22, align: "right-half" as const },
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
                borderBottomColor: "#111",
                opacity: active !== null && !isActive ? 0.3 : 1
              }}
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <Image src={sector.imageSrc} alt="" fill className="object-cover" sizes="100vw" />
              </div>

              {/* Overlay for darkening the background */}
              <div className="absolute inset-0 bg-black/40 transition-colors group-active:bg-black/60" />

              {/* Text Container */}
              <div className={`relative z-10 px-4 ${sector.align === 'center' ? 'w-full text-center' : 'w-1/2 ml-auto text-center'}`}>
                <span className="text-[clamp(1rem,4.5vw,1.3rem)] font-semibold uppercase tracking-wider text-white" style={{
                  textShadow: "0 2px 4px rgba(0,0,0,0.8)",
                  WebkitTextStroke: "1px rgba(0,0,0,0.4)",
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
        style={{ width: '50%', height: '50%' }}
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
          {/* Main Icon scaled naturally to fit the 50x50 area */}
          <Image src="/mainpage/mainpage-icon-mobile.png" alt="О художнице" fill className="object-contain" sizes="50vw" />
        </button>
      </div>
    </section>
  );
}
