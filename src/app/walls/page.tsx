import { PageBackground } from "@/components/layout/PageBackground";
import { WallsMarquee } from "@/components/carousel/WallsMarquee";

export default function WallsPage() {
  return (
    <PageBackground backgroundSrc="/mainpage/mainpage-back.png">
      {/* Constraints exactly to the viewport boundary to stop scrolling on mobile */}
      <div className="font-fontatica relative flex h-[100svh] w-full flex-col items-center justify-center overflow-hidden pb-[var(--nav-height-mobile)] lg:pb-[var(--nav-height-desktop)]">

        {/* Foreground Overlay Layer is now handled inside WallsMarquee for mobile interaction coordination */}
        <div className="absolute top-0 left-0 right-0 bottom-[var(--nav-height-mobile)] lg:bottom-[var(--nav-height-desktop)] z-0 flex items-center justify-center">
          <WallsMarquee>
            <div className="relative w-[78%] sm:w-[500px] md:w-[610px] h-auto flex flex-col justify-center bg-transparent border-none shadow-none md:my-auto shrink-0 z-20 font-comfortaa">

              <div className="bg-black/15 backdrop-blur-md rounded-xl p-3 md:p-4 mb-3 border border-white/10 w-full shrink-0 shadow-xl">
                <h1 className="font-abibas text-[20px] sm:text-[24px] md:text-[34px] font-bold text-center tracking-wide uppercase text-white/95 m-0 leading-[1.1]">
                  Художественная роспись интерьера
                </h1>
              </div>

              <div className="grid grid-cols-2 gap-2 md:gap-6 mb-3 text-[14px] md:text-[19px] leading-[1.2] shrink-0">
                {/* Left column */}
                <div className="flex flex-col gap-1 md:gap-2 bg-black/15 backdrop-blur-md rounded-xl p-3 md:p-4 border border-white/10 h-full shadow-xl">
                  <p className="font-abibas font-semibold text-[16px] md:text-[20px] text-white/95 border-b border-white/20 pb-1 md:pb-2 w-max leading-none">Роспись стен для:</p>
                  <ul className="list-none flex flex-col gap-[2px] md:gap-[4px] text-white/85">
                    <li>- квартир</li>
                    <li>- студий</li>
                    <li>- салонов</li>
                    <li>- кафе</li>
                    <li>- коммерческих пространств</li>
                  </ul>
                </div>

                {/* Right column */}
                <div className="flex flex-col gap-1 md:gap-2 bg-black/15 backdrop-blur-md rounded-xl p-3 md:p-4 border border-white/10 h-full shadow-xl">
                  <p className="font-abibas font-semibold text-[16px] md:text-[20px] text-white/95 border-b border-white/20 pb-1 md:pb-2 w-max leading-none">Этапы:</p>
                  <ul className="list-none flex flex-col gap-[2px] md:gap-[4px] text-white/85">
                    <li>- Выезд / обсуждение</li>
                    <li>- Подготовка эскиза</li>
                    <li>- Утверждение</li>
                    <li>- Реализация</li>
                  </ul>
                </div>
              </div>

              {/* Bottom section */}
              <div className="bg-black/15 backdrop-blur-md rounded-xl p-3 md:p-4 flex flex-col gap-2 md:gap-3 text-[14px] md:text-[19px] border border-white/10 shrink-0 mb-auto md:mb-0 shadow-xl leading-[1.2]">
                <p className="text-white/95">
                  Кастомизация мебели или других объектов в вашем пространстве.
                </p>
                <p className="text-white/95">
                  Работа выполняется под стиль интерьера и задачи помещения.
                </p>

                <div className="flex justify-between items-center p-0 rounded-lg pt-1">
                  <p className="font-abibas font-semibold text-[16px] md:text-[21px] text-white/95 shrink-0 pr-2 leading-none mt-1">Стоимость:</p>
                  <p className="text-white/85 text-right mt-1 leading-[1.1]">от 10 000 ₽ — зависит от сложности и объема</p>
                </div>
              </div>

            </div>
          </WallsMarquee>
        </div>

      </div>
    </PageBackground>
  );
}
