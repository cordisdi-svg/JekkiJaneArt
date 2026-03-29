import type { Metadata } from "next";
import { PageBackground } from "@/components/layout/PageBackground";
import { WallsMarquee } from "@/components/carousel/WallsMarquee";

export const metadata: Metadata = {
  title: "Роспись Стен | JekkiJaneArt",
  description: "Художественная роспись стен и интерьера для квартир, кафе и студий от JekkiJane.",
};

export default function WallsPage() {
  return (
    <PageBackground backgroundSrc="/mainpage/mainpage-back.webp">
      {/* Constraints exactly to the viewport boundary to stop scrolling on mobile */}
      <div className="font-fontatica relative flex h-[100svh] w-full flex-col items-center justify-center overflow-hidden pb-[var(--nav-height-mobile)] lg:pb-[var(--nav-height-desktop)]">

        {/* Foreground Overlay Layer is now handled inside WallsMarquee for mobile interaction coordination */}
        <div className="absolute top-0 left-0 right-0 bottom-[var(--nav-height-mobile)] lg:bottom-[var(--nav-height-desktop)] z-0 flex items-center justify-center">
          <WallsMarquee>
            <div className="relative w-[78%] sm:w-[500px] md:w-[40vw] md:max-w-[600px] md:h-[calc(100%-4rem)] flex flex-col justify-center bg-transparent border-none shadow-none md:my-auto shrink-0 z-20 font-comfortaa md:ml-8 md:mr-auto">

              <div className="relative before:absolute before:inset-0 before:bg-black/15 before:backdrop-blur-md before:rounded-xl before:border before:border-white/10 before:shadow-xl before:opacity-0 group-data-[visible=true]:before:opacity-100 before:transition-opacity before:duration-[1500ms] before:pointer-events-none p-3 md:p-5 mb-3 w-full shrink-0">
                <h1 className="relative z-10 font-fontatica text-[20px] sm:text-[24px] md:text-[32px] font-bold text-center tracking-wide uppercase text-white/95 m-0 leading-[1.1]">
                  Художественная роспись интерьера
                </h1>
              </div>

              <div className="grid grid-cols-2 gap-2 md:gap-6 mb-3 text-[14px] md:text-[17px] leading-[1.2] shrink-0">
                {/* Left column */}
                <div className="relative before:absolute before:inset-0 before:bg-black/15 before:backdrop-blur-md before:rounded-xl before:border before:border-white/10 before:shadow-xl before:opacity-0 group-data-[visible=true]:before:opacity-100 before:transition-opacity before:duration-[1500ms] before:pointer-events-none p-3 md:p-5 h-full flex flex-col gap-1 md:gap-3">
                  <p className="relative z-10 font-fontatica font-semibold text-[18px] md:text-[22px] text-white/95 border-b border-white/20 pb-1 md:pb-2 w-max leading-none">Роспись стен для:</p>
                  <ul className="relative z-10 list-none flex flex-col gap-[2px] md:gap-[4px] text-white/85">
                    <li>- квартир</li>
                    <li>- студий</li>
                    <li>- салонов</li>
                    <li>- кафе</li>
                    <li>- коммерческих пространств</li>
                  </ul>
                </div>

                {/* Right column */}
                <div className="relative before:absolute before:inset-0 before:bg-black/15 before:backdrop-blur-md before:rounded-xl before:border before:border-white/10 before:shadow-xl before:opacity-0 group-data-[visible=true]:before:opacity-100 before:transition-opacity before:duration-[1500ms] before:pointer-events-none p-3 md:p-5 h-full flex flex-col gap-1 md:gap-3">
                  <p className="relative z-10 font-fontatica font-semibold text-[18px] md:text-[22px] text-white/95 border-b border-white/20 pb-1 md:pb-2 w-max leading-none">Этапы работы</p>
                  <ul className="relative z-10 list-none flex flex-col gap-[2px] md:gap-[4px] text-white/85">
                    <li>- Консультация и обсуждение идеи</li>
                    <li>- Разработка эскиза</li>
                    <li>- Согласование деталей</li>
                    <li>- Реализация</li>
                  </ul>
                </div>
              </div>

              {/* Bottom section */}
              <div className="relative before:absolute before:inset-0 before:bg-black/15 before:backdrop-blur-md before:rounded-xl before:border before:border-white/10 before:shadow-xl before:opacity-0 group-data-[visible=true]:before:opacity-100 before:transition-opacity before:duration-[1500ms] before:pointer-events-none p-3 md:p-6 flex flex-col gap-2 md:gap-3 text-[14px] md:text-[18px] shrink-0 mb-auto md:mb-0 shadow-xl leading-[1.2]">
                <p className="relative z-10 text-white/95">
                  Кастомизация мебели или других объектов в вашем пространстве.
                </p>
                <p className="relative z-10 text-white/95">
                  Работа выполняется под стиль интерьера и задачи помещения.
                </p>

                <div className="relative z-10 flex justify-between items-center p-0 rounded-lg pt-1">
                  <p className="font-fontatica font-semibold text-[18px] md:text-[24px] text-white/95 shrink-0 pr-2 leading-none mt-1">Стоимость:</p>
                  <p className="text-white/85 text-right mt-1 leading-[1.1] text-[12.5px] md:text-[16px]">от 10 000 ₽ — зависит от сложности и объема</p>
                </div>
              </div>

            </div>
          </WallsMarquee>
        </div>

      </div>
    </PageBackground>
  );
}
