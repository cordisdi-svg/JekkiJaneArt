"use client";

import Image from "next/image";
import { PageBackground } from "@/components/layout/PageBackground";
import { WearMarquee } from "@/components/carousel/WearMarquee";
import { FlippingWearCard } from "@/components/carousel/FlippingWearCard";

import { TypewriterText } from "@/components/ui/TypewriterText";

const typedContentChars = [
  { text: "Роспись выполняется вручную и превращает обычную вещь в уникальный арт-объект.\nКаждая работа — единственный экземпляр, созданный вручную. Вы получаете вещь, которой больше ни у кого не будет.\n\nВозможна роспись:\n", delay: 15 },
  { text: "— джинсов\n— худи и свитшотов\n— футболок\n— курток\n— кед и кроссовок\n— сумок\n", delay: 10 },
  { text: "Каждая работа создаётся по индивидуальному эскизу с учётом ваших идей, стиля и пожеланий.\n\nИспользуются профессиональные текстильные краски, устойчивые к влаге и стирке.\nРисунок сохраняет цвет и детализацию даже при регулярной носке.\n\nЧто можно сделать:\n", delay: 15 },
  { text: "• создать полностью уникальный дизайн\n• перенести арт, символ или персонажа на одежду\n• кастомизировать любимую вещь\n• разработать образ для съёмок, выступлений или бренда\n\nКак проходит работа:\n\n1. Обсуждение идеи\nВы рассказываете свою идею, пожелания, стиль или присылаете референсы.\n\n2. Разработка эскиза\nЯ создаю художественный эскиз будущей росписи.\n\n3. Согласование\nМы обсуждаем детали и при необходимости вносим правки.\n\n4. Создание росписи\nПосле утверждения я приступаю к ручной росписи изделия.\n\n5. Готовая работа\nВы получаете уникальную вещь, созданную специально для вас.\n\nПочему заказывают у меня:\n", delay: 15 },
  { text: "• полностью ручная работа\n• индивидуальные эскизы\n• профессиональные краски для текстиля\n• рисунок устойчив к стирке и влаге\n• каждая работа — уникальный экземпляр", delay: 15 }
];

import React, { useRef, useEffect } from "react";

function DesktopTextContent() {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
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
        .custom-transparent-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(255, 255, 255, 0.5);
        }
      `}</style>

      {/* Static Title */}
      <h2 className="font-abibas text-2xl lg:text-3xl xl:text-4xl text-center mb-6 mt-2">
        Индивидуальная художественная роспись одежды и обуви
      </h2>

      {/* Scrollable Unified Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto custom-transparent-scrollbar pr-3 pb-4"
      >
        <TypewriterText delay={25} cursorChar="_" scrollRef={scrollRef}>
          <p className="mb-4">
            Роспись выполняется вручную и превращает обычную вещь в уникальный арт-объект.
            <br />
            Каждая работа — единственный экземпляр, созданный вручную. Вы получаете вещь, которой больше ни у кого не будет.
          </p>

          <p className="font-abibas text-[20px] xl:text-[24px] mb-2 font-bold leading-tight">
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

          <p className="font-abibas text-[20px] xl:text-[24px] mb-2 font-bold leading-tight">
            Что можно сделать
          </p>
          <ul className="list-none flex flex-col gap-1 mb-4">
            <li>• создать полностью уникальный дизайн</li>
            <li>• перенести арт, символ или персонажа на одежду</li>
            <li>• кастомизировать любимую вещь</li>
            <li>• разработать образ для съёмок, выступлений или бренда</li>
          </ul>

          <p className="font-abibas text-[20px] xl:text-[24px] mb-2 font-bold leading-tight">
            Как проходит работа
          </p>
          <div className="flex flex-col gap-3 mb-4">
            <div>
              <strong>1. Обсуждение идеи</strong><br />
              Вы рассказываете свою идею, пожелания, стиль или присылаете референсы.
            </div>
            <div>
              <strong>2. Разработка эскиза</strong><br />
              Я создаю художественный эскиз будущей росписи.
            </div>
            <div>
              <strong>3. Согласование</strong><br />
              Мы обсуждаем детали и при необходимости вносим правки.
            </div>
            <div>
              <strong>4. Создание росписи</strong><br />
              После утверждения я приступаю к ручной росписи изделия.
            </div>
            <div>
              <strong>5. Готовая работа</strong><br />
              Вы получаете уникальную вещь, созданную специально для вас.
            </div>
          </div>

          <p className="font-abibas text-[20px] xl:text-[24px] mb-2 font-bold leading-tight">
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
        </TypewriterText>
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
      <div className="font-fontatica relative h-[100svh] w-full overflow-hidden pb-[var(--nav-height-mobile)] lg:pb-[var(--nav-height-desktop)]">

        {/* ── МОБИЛА ── */}
        <div className="md:hidden h-full relative">

          {/* Прокручивающаяся карусель из двух картинок */}
          <WearMarquee />

          {/* Фиксированный текст по центру — висит над каруселью */}
          <div
            className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none px-6"
          >
            <div
              className="flex flex-col gap-1 text-white font-bold text-[14px] leading-tight text-left"
              style={strokeStyle}
            >
              <p className="font-abibas text-[20px] font-extrabold tracking-wide uppercase leading-none pb-1">
                Художественная роспись одежды и обуви
              </p>
              <ul className="list-none flex flex-col gap-[1px]">
                <li>— джинсовок</li>
                <li>— худи</li>
                <li>— футболок</li>
                <li>— кед</li>
                <li>— кроссовок</li>
              </ul>
              <p className="mt-1">Каждая вещь — уникальный арт-объект.</p>
              <p>Водостойкая краска, не портится при стирке.</p>
              <p className="mt-1 text-[16px] leading-[1.1]">
                <span className="font-abibas text-[18px] font-extrabold pr-1">Стоимость:</span> от 5 000 ₽ — зависит от сложности
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
        <div className="hidden md:flex flex-row items-stretch justify-center gap-4 px-4 w-full h-full py-[2vh]">

          {/* Изображение 1 (левое) */}
          <div className="h-full aspect-[11/16] flex-shrink-0 drop-shadow-2xl">
            <FlippingWearCard
              images={["/wear-and-shoes/1.png", "/wear-and-shoes/2.jpeg", "/wear-and-shoes/3.jpeg", "/wear-and-shoes/4.png", "/wear-and-shoes/5.png"]}
              startIntervalIdx={0}
            />
          </div>

          {/* Текстовая зона: растянута по высоте контейнера */}
          <div className="flex-1 flex flex-col justify-stretch h-full max-w-[550px] lg:max-w-[650px]">
            <div className="bg-black/25 backdrop-blur-md rounded-2xl p-4 lg:p-6 lg:pr-3 border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.6)] w-full flex flex-col h-full overflow-hidden">
              <DesktopTextContent />
            </div>
          </div>

          {/* Изображение 2 (правое) */}
          <div className="h-full aspect-[11/16] flex-shrink-0 drop-shadow-2xl">
            <FlippingWearCard
              images={["/wear-and-shoes/3.jpeg", "/wear-and-shoes/4.png", "/wear-and-shoes/5.png", "/wear-and-shoes/1.png", "/wear-and-shoes/2.jpeg"]}
              startIntervalIdx={1}
            />
          </div>

        </div>
      </div>
    </PageBackground>
  );
}
