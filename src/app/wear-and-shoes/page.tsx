import Image from "next/image";
import { PageBackground } from "@/components/layout/PageBackground";
import { WearMarquee } from "@/components/carousel/WearMarquee";

function DesktopTextContent() {
  return (
    <div className="flex flex-col gap-3 text-white text-[13px] lg:text-[15px] leading-relaxed">
      <p className="text-[15px] lg:text-[17px] font-bold text-white/95">
        Индивидуальная художественная роспись:
      </p>
      <ul className="list-none flex flex-col gap-1 pl-1 text-white/85">
        <li>— джинсовок</li>
        <li>— худи</li>
        <li>— футболок</li>
        <li>— кед</li>
        <li>— кроссовок</li>
      </ul>
      <p className="text-white/90">
        Каждая вещь превращается в уникальный арт-объект.
      </p>
      <p className="text-white/90">
        Выполняется водостойкой краской, не портится при стирке.
      </p>
      <div className="mt-2 border-t border-white/15 pt-3 flex flex-col gap-1">
        <p className="font-bold text-white/95">Стоимость:</p>
        <p className="text-white/85">
          от 5 000 ₽ за изделие — зависит от сложности рисунка
        </p>
      </div>
    </div>
  );
}

// Общий стиль текст-оверлея на мобиле (text-stroke через inline style)
const strokeStyle: React.CSSProperties = {
  WebkitTextStroke: "1.2px rgba(0,0,0,0.85)",
  paintOrder: "stroke fill" as React.CSSProperties["paintOrder"],
};

export default function WearAndShoesPage() {
  return (
    <PageBackground backgroundSrc="/mainpage/mainpage-back.png">
      {/* Активная зона */}
      <div className="relative h-[100svh] w-full overflow-hidden pb-[var(--nav-height-mobile)] lg:pb-[var(--nav-height-desktop)]">

        {/* ── МОБИЛА ── */}
        <div className="md:hidden h-full relative">

          {/* Прокручивающаяся карусель из двух картинок */}
          <WearMarquee />

          {/* Фиксированный текст по центру — висит над каруселью */}
          <div
            className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none px-6"
          >
            <div
              className="flex flex-col gap-2 text-white font-bold text-[12px] leading-snug text-left"
              style={strokeStyle}
            >
              <p className="text-[15px] font-extrabold tracking-wide uppercase">
                Художественная роспись одежды и обуви
              </p>
              <ul className="list-none flex flex-col gap-[3px] mt-1">
                <li>— джинсовок</li>
                <li>— худи</li>
                <li>— футболок</li>
                <li>— кед</li>
                <li>— кроссовок</li>
              </ul>
              <p className="mt-1">Каждая вещь — уникальный арт-объект.</p>
              <p>Водостойкая краска, не портится при стирке.</p>
              <p className="mt-2 font-extrabold text-[13px]">
                Стоимость: от 5 000 ₽ — зависит от сложности
              </p>
            </div>
          </div>
        </div>

        {/* ── ДЕСКТОП: два изображения + текст по центру ── */}
        {/*
          Отступы:
          - Изображения: px-4 контейнера + my-4 → gap-4 от всех краёв
          - Текст-зона: flex-1 my-12 → gap-12 сверху/снизу; gap-4 от картинок (flex gap-4)
          - Textbox: h-auto (по высоте контента, без растягивания)
        */}
        <div className="hidden md:flex flex-row items-stretch gap-4 px-4 w-full h-full">

          {/* Изображение 1 (левое) */}
          <div className="relative aspect-[3/4] flex-shrink-0 overflow-hidden rounded-2xl shadow-xl my-4">
            <Image
              src="/wear-and-shoes/1.png"
              alt="Роспись одежды"
              fill
              className="object-cover"
              sizes="25vw"
              priority
            />
          </div>

          {/* Текстовая зона: центрирована по вертикали, box — по контенту */}
          <div className="flex-1 flex items-center justify-center my-12">
            <div className="bg-black/15 backdrop-blur-md rounded-2xl p-5 lg:p-7 border border-white/10 shadow-xl w-full">
              <DesktopTextContent />
            </div>
          </div>

          {/* Изображение 2 (правое) */}
          <div className="relative aspect-[3/4] flex-shrink-0 overflow-hidden rounded-2xl shadow-xl my-4">
            <Image
              src="/wear-and-shoes/2.JPEG"
              alt="Роспись обуви"
              fill
              className="object-cover"
              sizes="25vw"
              priority
            />
          </div>

        </div>
      </div>
    </PageBackground>
  );
}
