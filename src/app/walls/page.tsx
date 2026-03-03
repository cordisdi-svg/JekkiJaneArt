import { PageBackground } from "@/components/layout/PageBackground";
import { WallsMarquee } from "@/components/carousel/WallsMarquee";

export default function WallsPage() {
  return (
    <PageBackground backgroundSrc="/mainpage/mainpage-back.png">
      {/* Constraints exactly to the viewport boundary to stop scrolling on mobile */}
      <div className="relative flex h-[100svh] w-full flex-col items-center justify-center overflow-hidden pb-[var(--nav-height-mobile)] lg:pb-[var(--nav-height-desktop)]">

        {/* Background Marquee centered exactly in active physical zone */}
        <div className="absolute top-0 left-0 right-0 bottom-[var(--nav-height-mobile)] lg:bottom-[var(--nav-height-desktop)] z-0 flex items-center justify-center pointer-events-none">
          <WallsMarquee />
        </div>

        {/* Foreground Overlay Layer matching the required text box */}
        <div className="relative z-10 w-[78%] sm:w-[500px] md:w-[610px] h-auto flex flex-col justify-center bg-transparent border-none shadow-none md:my-auto shrink-0 z-20">

          <div className="bg-black/15 backdrop-blur-md rounded-xl p-3 md:p-4 mb-4 border border-white/10 w-full shrink-0 shadow-xl">
            <h1 className="text-[17px] sm:text-[20px] md:text-2xl font-bold text-center tracking-wide uppercase text-white/95 m-0">
              Художественная роспись интерьера
            </h1>
          </div>

          <div className="grid grid-cols-2 gap-3 md:gap-8 mb-4 text-[12px] md:text-[15px] leading-tight shrink-0">
            {/* Left column */}
            <div className="flex flex-col gap-2 bg-black/15 backdrop-blur-md rounded-xl p-4 border border-white/10 h-full shadow-xl">
              <p className="font-semibold text-white/95 border-b border-white/20 pb-2 w-max">Роспись стен для:</p>
              <ul className="list-none flex flex-col gap-[4px] text-white/85">
                <li>- квартир</li>
                <li>- студий</li>
                <li>- салонов</li>
                <li>- кафе</li>
                <li>- коммерческих пространств</li>
              </ul>
            </div>

            {/* Right column */}
            <div className="flex flex-col gap-2 bg-black/15 backdrop-blur-md rounded-xl p-4 border border-white/10 h-full shadow-xl">
              <p className="font-semibold text-white/95 border-b border-white/20 pb-2 w-max">Этапы:</p>
              <ul className="list-none flex flex-col gap-[4px] text-white/85">
                <li>- Выезд / обсуждение</li>
                <li>- Подготовка эскиза</li>
                <li>- Утверждение</li>
                <li>- Реализация</li>
              </ul>
            </div>
          </div>

          {/* Bottom section */}
          <div className="bg-black/15 backdrop-blur-md rounded-xl p-4 flex flex-col gap-4 text-[12px] md:text-[15px] border border-white/10 shrink-0 mb-auto md:mb-0 shadow-xl">
            <p className="text-white/95 leading-tight">
              Кастомизация мебели или других объектов в вашем пространстве.
            </p>
            <p className="text-white/95 leading-tight">
              Работа выполняется под стиль интерьера и задачи помещения.
            </p>

            <div className="flex justify-between items-center p-0 rounded-lg">
              <p className="font-semibold text-white/95 shrink-0 pr-2">Стоимость:</p>
              <p className="text-white/85 text-right">от 10 000 ₽ — зависит от сложности и объема</p>
            </div>
          </div>

        </div>

      </div>
    </PageBackground>
  );
}
