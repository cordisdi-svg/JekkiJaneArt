"use client";

import { useRef } from "react";
import { PageBackground } from "@/components/layout/PageBackground";
import { WearMarquee } from "@/components/carousel/WearMarquee";
import { FlippingWearCard } from "@/components/carousel/FlippingWearCard";

import { TypewriterText } from "@/components/ui/TypewriterText";


export default function WearAndShoesPage() {
  const scrollRefDesktop = useRef<HTMLDivElement>(null);
  const scrollRefMobile = useRef<HTMLDivElement>(null);

  return (
    <PageBackground backgroundSrc="/mainpage/mainpage-back.png">
      {/* Активная зона */}
      <div className="font-comfortaa-light relative h-[100svh] w-full overflow-hidden pb-[var(--nav-height-mobile)] lg:pb-[var(--nav-height-desktop)]">

        {/* ── МОБИЛА ── */}
        <div className="md:hidden h-full relative">

          {/* Прокручивающаяся карусель из изображений */}
          <WearMarquee />

          {/* Текстовый блок сверху с подложкой и анимацией */}
          <div className="absolute inset-x-0 top-0 pt-4 px-6 z-10 pointer-events-none">
            <div
              className="bg-black/40 backdrop-blur-md rounded-2xl p-4 border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.5)] flex flex-col pointer-events-auto"
              style={{
                height: "calc(0.5 * (100svh - var(--nav-height-mobile) - 1rem))",
              }}
            >
              <style>{`
                  .custom-transparent-scrollbar::-webkit-scrollbar {
                    width: 4px;
                    background: transparent;
                  }
                  .custom-transparent-scrollbar::-webkit-scrollbar-thumb {
                    background-color: rgba(255, 255, 255, 0.3);
                    border-radius: 10px;
                  }
                `}</style>
              <div 
                ref={scrollRefMobile}
                className="overflow-y-auto overscroll-contain custom-transparent-scrollbar pr-1"
                style={{ touchAction: "pan-y" }}
              >
                <div className="text-white text-[15px] leading-[1.4] font-comfortaa-light">
                  <TypewriterText scrollRef={scrollRefMobile} delay={26}>
                    {DesktopContent({ showTitle: true })}
                  </TypewriterText>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── ДЕСКТОП: два изображения + текст по центру ── */}
        <div className="hidden md:flex flex-row items-stretch justify-center gap-4 px-4 w-full h-full py-[2vh]">

          {/* Изображение 1 (левое) */}
          <div className="h-full aspect-[11/16] flex-shrink-0 drop-shadow-2xl">
            <FlippingWearCard
              images={["/wear-and-shoes/1.png", "/wear-and-shoes/2.jpeg", "/wear-and-shoes/3.jpeg", "/wear-and-shoes/4.png", "/wear-and-shoes/5.png"]}
              initialDelay={6000}
              interval={6000}
            />
          </div>

          {/* Текстовая зона: растянута по высоте контейнера */}
          <div className="flex-1 flex flex-col justify-stretch h-full max-w-[550px] lg:max-w-[650px]">
            <div className="bg-black/25 backdrop-blur-md rounded-2xl p-4 lg:p-6 lg:pr-3 border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.6)] w-full flex flex-col h-full overflow-hidden">
              <div className="flex flex-col h-full overflow-hidden text-white text-[16px] xl:text-[20px] leading-[1.3] relative pl-1 pr-1">
                <style>{`
                  .custom-transparent-scrollbar::-webkit-scrollbar {
                    width: 8px;
                    background: transparent;
                  }
                  .custom-transparent-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                  }
                  .custom-transparent-scrollbar::-webkit-scrollbar-thumb {
                    background-color: rgba(255, 255, 255, 0.3);
                    border-radius: 10px;
                  }
                  .custom-transparent-scrollbar::-webkit-scrollbar-button {
                    display: block;
                    height: 10px;
                    background: transparent;
                  }
                `}</style>

                {/* Static Title */}
                <h2 className="font-fontatica text-[28px] lg:text-[42px] xl:text-[50px] text-center mb-4 mt-2 leading-tight uppercase font-bold text-white/95">
                  Роспись одежды и обуви
                </h2>

                {/* Scrollable Unified Area */}
                <div
                  ref={scrollRefDesktop}
                  className="flex-1 overflow-y-auto overscroll-contain custom-transparent-scrollbar pr-3 pb-4"
                  style={{ touchAction: "pan-y" }}
                >
                  <TypewriterText scrollRef={scrollRefDesktop} delay={26}>
                    {DesktopContent()}
                  </TypewriterText>
                </div>
              </div>
            </div>
          </div>

          {/* Изображение 2 (правое) */}
          <div className="h-full aspect-[11/16] flex-shrink-0 drop-shadow-2xl">
            <FlippingWearCard
              images={["/wear-and-shoes/3.jpeg", "/wear-and-shoes/4.png", "/wear-and-shoes/5.png", "/wear-and-shoes/1.png", "/wear-and-shoes/2.jpeg"]}
              initialDelay={2500}
              interval={6000}
            />
          </div>

        </div>
      </div>
    </PageBackground>
  );
}

function DesktopContent({ showTitle = false }: { showTitle?: boolean } = {}) {
  return (
    <>
      {showTitle && (
        <h2 className="font-fontatica text-[24px] lg:text-[28px] text-center mb-6 mt-2 uppercase font-bold text-white/95">
          Роспись одежды и обуви
        </h2>
      )}
      <p className="mb-4">
        Роспись выполняется вручную и превращает обычную вещь в уникальный арт-объект.
        <br />
        Каждая работа — единственный экземпляр, созданный вручную. Вы получаете вещь, которой больше ни у кого не будет.
      </p>

      <p className="font-fontatica text-[28px] xl:text-[34px] mb-2 font-bold leading-tight">
        Возможна роспись:
      </p>
      <ul className="list-none flex flex-col gap-1 mb-4">
        <li>— джинсов</li>
        <li>— худи и свитшотов</li>
        <li>— футболок</li>
        <li>— курток</li>
        <li>— кед и кроссовок</li>
        <li>— сумок</li>
      </ul>

      <p className="mb-4">
        Каждая работа создаётся по индивидуальному эскизу с учётом ваших идей, стиля и пожеланий.
      </p>
      <p className="mb-4">
        Используются профессиональные текстильные краски, устойчивые к влаге и стирке.
        <br />
        Рисунок сохраняет цвет и детализацию даже при регулярной носке.
      </p>

      <p className="font-fontatica text-[28px] xl:text-[34px] mb-2 font-bold leading-tight">
        Что можно сделать
      </p>
      <ul className="list-none flex flex-col gap-1 mb-4">
        <li>• создать полностью уникальный дизайн</li>
        <li>• перенести арт, символ или персонажа на одежду</li>
        <li>• кастомизировать любимую вещь</li>
        <li>• разработать образ для съёмок, выступлений или бренда</li>
      </ul>

      <p className="font-fontatica text-[28px] xl:text-[34px] mb-2 font-bold leading-tight">
        Как проходит работа
      </p>
      <div className="flex flex-col gap-3 mb-4">
        <div>
          <strong>1. Обсуждение идеи</strong><br /><br />
          Вы рассказываете свою идею, пожелания, стиль или присылаете референсы.
        </div>
        <div>
          <strong>2. Разработка эскиза</strong><br /><br />
          Я создаю художественный эскиз будущей росписи.
        </div>
        <div>
          <strong>3. Согласование</strong><br /><br />
          Мы обсуждаем детали и при необходимости вносим правки.
        </div>
        <div>
          <strong>4. Создание росписи</strong><br /><br />
          После утверждения я приступаю к ручной росписи изделия.
        </div>
        <div>
          <strong>5. Готовая работа</strong><br /><br />
          Вы получаете уникальную вещь, созданную специально для вас.
        </div>
      </div>

      <p className="font-fontatica text-[28px] xl:text-[34px] mb-2 font-bold leading-tight">
        Почему заказывают у меня
      </p>
      <ul className="list-none flex flex-col gap-1 mb-6">
        <li>• полностью ручная работа</li>
        <li>• индивидуальные эскизы</li>
        <li>• профессиональные краски для текстиля</li>
        <li>• рисунок устойчив к стирке и влаге</li>
        <li>• каждая работа — уникальный экземпляр</li>
      </ul>

      <div className="mt-4 flex flex-col items-center text-center gap-2">
        <p className="text-[17px] xl:text-[20px] font-bold text-white/95 leading-tight mb-1">
          Итоговая цена зависит от:
        </p>
        <div className="flex flex-col text-[15px] xl:text-[18px] text-white/85 leading-tight text-center w-full max-w-[300px] mb-1">
          <span>— размера рисунка</span>
          <span>— сложности композиции</span>
          <span>— количества деталей</span>
          <span>— типа материала</span>
        </div>
        <p className="mt-1 text-[16px] xl:text-[18px] leading-[1.1]">
          <span className="font-abibas text-[20px] xl:text-[24px] font-extrabold pr-1">Стоимость:</span> от 5 000 ₽
        </p>
      </div>
    </>
  );
}
