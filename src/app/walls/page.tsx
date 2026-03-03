import { PageBackground } from "@/components/layout/PageBackground";
import { WallsMarquee } from "@/components/carousel/WallsMarquee";

export default function WallsPage() {
  return (
    <PageBackground backgroundSrc="/mainpage/mainpage-back.png">
      <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">

        {/* Background Marquee */}
        <div className="absolute inset-0 z-0 flex items-center pb-[env(safe-area-inset-bottom)] pt-[80px]">
          <WallsMarquee />
        </div>

        {/* Foreground Overlay Layer matching the required text box */}
        <div className="relative z-10 w-[92%] sm:w-[500px] md:w-[680px] h-auto min-h-[520px] rounded-3xl bg-black/60 backdrop-blur-xl border border-white/15 p-6 md:p-10 shadow-2xl flex flex-col">
          <h1 className="text-[20px] md:text-2xl font-bold text-center tracking-wide uppercase mb-6 md:mb-8 text-white/95">
            Художественная роспись интерьера
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6 md:mb-8 text-[13px] md:text-[15px] leading-relaxed">
            {/* Left column */}
            <div className="flex flex-col gap-3">
              <p className="font-semibold text-white/95 border-b border-white/20 pb-2 w-max">Роспись стен для:</p>
              <ul className="list-none flex flex-col gap-[6px] text-white/85">
                <li>- квартир</li>
                <li>- студий</li>
                <li>- салонов</li>
                <li>- кафе</li>
                <li>- коммерческих пространств</li>
              </ul>
            </div>

            {/* Right column */}
            <div className="flex flex-col gap-3">
              <p className="font-semibold text-white/95 border-b border-white/20 pb-2 w-max">Этапы:</p>
              <ul className="list-none flex flex-col gap-[6px] text-white/85">
                <li>- Выезд / обсуждение по фото</li>
                <li>- Подготовка эскиза</li>
                <li>- Утверждение</li>
                <li>- Реализация</li>
              </ul>
            </div>
          </div>

          {/* Bottom section */}
          <div className="mt-auto flex flex-col gap-5 text-[13px] md:text-[15px] border-t border-white/20 pt-6">
            <p className="text-white/95 leading-relaxed">
              Кастомизация мебели или других объектов в вашем пространстве.<br className="hidden md:block" />
              Работа выполняется под стиль интерьера и задачи помещения.
            </p>

            <div className="flex flex-col gap-1">
              <p className="font-semibold text-white/95">Стоимость:</p>
              <p className="text-white/85">от 10 000 ₽ — зависит от сложности и объема</p>
            </div>

            <div className="flex flex-col gap-1 text-white/70 text-xs md:text-sm mt-2">
              <p>Больше примеров работ по запросу</p>
              <p className="italic">Если есть вопросы перед работой — задай</p>
            </div>
          </div>
        </div>

      </div>
    </PageBackground>
  );
}
