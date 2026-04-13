"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";

const links = [
  { icon: "/Telegram_logo.svg.webp", href: "https://t.me/magimist", label: "Telegram создателя сайта" },
  { icon: "/Instagram_icon.webp", href: "https://www.instagram.com/magistr_iney", label: "Instagram создателя сайта" }
];

export function SiteCreatorModalContent() {
  const [hasScrolled, setHasScrolled] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollEl = scrollRef.current;
    if (!scrollEl) return;

    const handleScroll = () => {
      if (scrollEl.scrollTop > 5) {
        setHasScrolled(true);
      } else {
        setHasScrolled(false);
      }
    };

    scrollEl.addEventListener('scroll', handleScroll, { passive: true });
    return () => scrollEl.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="flex flex-col h-full text-sm leading-relaxed overflow-hidden" style={{ fontFamily: "Comfortaa, sans-serif" }}>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto pr-2 flex flex-col gap-5 disable-default-scrollbar relative pb-4"
        onTouchStart={(e) => {
          if (scrollRef.current && scrollRef.current.scrollTop > 0) {
            e.currentTarget.dataset.startedNotAtTop = "true";
          } else {
            e.currentTarget.dataset.startedNotAtTop = "false";
          }
        }}
        onTouchMove={(e) => {
          if (e.currentTarget.dataset.startedNotAtTop === "true" || (scrollRef.current && scrollRef.current.scrollTop > 0)) {
            e.stopPropagation();
          }
        }}
      >

        <div className="text-center mt-1">
          <p className="font-fontatica text-2xl md:text-3xl mb-0 text-white drop-shadow-md">Web-разработка</p>
        </div>

        <div className="space-y-5">
          {/* Motion */}
          <div>
            <div className="flex gap-2.5 items-start mb-2">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="mt-[5px] flex-shrink-0 text-[#A01648] brightness-150 drop-shadow-[0_0_5px_rgba(205,38,100,0.4)]"><path d="M5 3l14 9-14 9V3z" /></svg>
              <p className="text-[16px] leading-tight">
                <span className="font-bold">Motion-лендинг</span> — мощная презентация вашего продукта или бизнеса
              </p>
            </div>
            <ul className="space-y-1.5 pl-6 text-[14px]" style={{ fontWeight: 300 }}>
              <li className="flex gap-2 items-start">
                <span className="font-semibold text-white/80 mt-[1px]">•</span>
                <span>Интерактив, анимации, плавные переходы и динамичный интерфейс усиливающие восприятие продукта и удержание внимания</span>
              </li>
              <li className="flex gap-2 items-start">
                <span className="font-semibold text-white/80 mt-[1px]">•</span>
                <span>Грамотный маршрут пользователя на сайте</span>
              </li>
              <li className="flex gap-2 items-start">
                <span className="font-semibold text-white/80 mt-[1px]">•</span>
                <span>Сильный визуальный эффект и акцент на главных продающих сторонах продукта</span>
              </li>
            </ul>
          </div>

          {/* Multiview */}
          <div>
            <div className="flex gap-2.5 items-start mb-2">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="mt-[5px] flex-shrink-0 text-[#A01648] brightness-150 drop-shadow-[0_0_5px_rgba(205,38,100,0.4)]"><path d="M5 3l14 9-14 9V3z" /></svg>
              <p className="text-[16px] leading-tight">
                <span className="font-bold">Многостраничный сайт</span> — полноценная платформа для вашего продукта или бизнеса
              </p>
            </div>
            <ul className="space-y-1.5 pl-6 text-[14px]" style={{ fontWeight: 300 }}>
              <li className="flex gap-2 items-start">
                <span className="font-semibold text-white/80 mt-[1px]">•</span>
                <span>Продуманная структура и логика взаимодействия с акцентом на визуальную подачу, балансом информативности, удобства пользования и навигации</span>
              </li>
              <li className="flex gap-2 items-start">
                <span className="font-semibold text-white/80 mt-[1px]">•</span>
                <span>Последовательная подача информации и целостный визуальный стиль.</span>
              </li>
              <li className="flex gap-2 items-start">
                <span className="font-semibold text-white/80 mt-[1px]">•</span>
                <span>Интеграция функционала: личный кабинет, формы, оплаты</span>
              </li>
            </ul>
          </div>

          {/* Tilda */}
          <div>
            <div className="flex gap-2.5 items-start mb-2">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="mt-[5px] flex-shrink-0 text-[#A01648] brightness-150 drop-shadow-[0_0_5px_rgba(205,38,100,0.4)]"><path d="M5 3l14 9-14 9V3z" /></svg>
              <p className="text-[16px] leading-tight">
                <span className="font-bold">Tilda</span> — быстрый запуск лендинга или мультиссылки
              </p>
            </div>
            <ul className="space-y-1.5 pl-6 text-[14px]" style={{ fontWeight: 300 }}>
              <li className="flex gap-2 items-start">
                <span className="font-semibold text-white/80 mt-[1px]">•</span>
                <span>Индивидуальная настройка, адаптация под задачи и аккуратный визуальный результат</span>
              </li>
              <li className="flex gap-2 items-start">
                <span className="font-semibold text-white/80 mt-[1px]">•</span>
                <span>Узнаваемый &quot;блочный&quot; стиль</span>
              </li>
              <li className="flex gap-2 items-start">
                <span className="font-semibold text-white/80 mt-[1px]">•</span>
                <span>Быстрая сборка и самая низкая цена на рынке</span>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <div className="flex gap-2.5 items-start mb-2">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="mt-[5px] flex-shrink-0 text-[#A01648] brightness-150 drop-shadow-[0_0_5px_rgba(205,38,100,0.4)]"><path d="M5 3l14 9-14 9V3z" /></svg>
              <p className="text-[16px] leading-tight">
                <span className="font-bold">Доработка/поддержка</span> - работа с уже существующим сайтом
              </p>
            </div>
            <ul className="space-y-1.5 pl-6 text-[14px]" style={{ fontWeight: 300 }}>
              <li className="flex gap-2 items-start">
                <span className="font-semibold text-white/80 mt-[1px]">•</span>
                <span>Внесение нового контента/механик, починка багов</span>
              </li>
              <li className="flex gap-2 items-start">
                <span className="font-semibold text-white/80 mt-[1px]">•</span>
                <span>Сотрудничество на постоянной основе</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="py-2">
          <p className="italic text-center text-[15px] font-light text-white/95 border-l-2 border-r-2 border-[#A01648]/40 px-3 py-1">
            Креативно подхожу к разработке, продумываю визуал и логику сайта, адаптируя его под задачи, аудиторию и ожидания клиента
          </p>
        </div>

        <div>
          <p className="font-fontatica text-2xl md:text-3xl mb-1 mt-1 text-center text-white drop-shadow-md">Этапы</p>
          <ul className="space-y-3 pl-2" style={{ fontWeight: 300 }}>
            <li className="flex gap-2 items-start">
              <span className="font-semibold text-white/50 mt-[2px]">•</span>
              <span>Разбираемся с целью, ожиданиями от дизайна, находим решения отличающие вас от остальных - помогаю формулировать ваш запрос</span>
            </li>
            <li className="flex gap-2 items-start">
              <span className="font-semibold text-white/50 mt-[2px]">•</span>
              <span>Анализ конкурентов, удачных решений на рынке - ищем оптимальный формат под вас</span>
            </li>
            <li className="flex gap-2 items-start">
              <span className="font-semibold text-white/50 mt-[2px]">•</span>
              <span>В процессе работы смотрим на прототип, корректируем под ваше видение</span>
            </li>
            <li className="flex gap-2 items-start">
              <span className="font-semibold text-white/50 mt-[2px]">•</span>
              <span>Вносим правки перед финализацией</span>
            </li>
            <li className="flex gap-2 items-start">
              <span className="font-semibold text-white/50 mt-[2px]">•</span>
              <span>Полное соответствие актуальному законодательству</span>
            </li>
            <li className="flex gap-2 items-start">
              <span className="font-semibold text-white/50 mt-[2px]">•</span>
              <span>Поддержка после передачи готового продукта</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Fixed Button block at the bottom */}
      <div className="shrink-0 pt-4 mt-2 border-t border-white/10 relative">
        <div className="bg-white/5 rounded-xl p-3 text-center border border-white/10 shadow-sm relative z-10">
          <p className="font-semibold text-[15px] mb-2 text-[#A01648] brightness-150 drop-shadow-[0_0_8px_rgba(205,38,100,0.5)]">
            Сейчас беру 3 промо-кейса со скидкой 30% от рынка
          </p>

          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="text-white/80 font-light mt-0.5">доступно:</span>
            <span className="flex items-center justify-center bg-black/40 border border-black text-white font-bold rounded-md min-w-[28px] h-7 px-2 shadow-inner">
              3
            </span>
          </div>

          <div className="flex items-center justify-center gap-5">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                aria-label={link.label}
                className="flex h-[48px] w-[48px] items-center justify-center rounded-full border border-white/20 bg-black/30 backdrop-blur-md transition-transform hover:scale-110 active:scale-95 shadow-md pl-[1px]"
              >
                <Image src={link.icon} alt="" width={28} height={28} className="object-contain" unoptimized />
              </a>
            ))}
          </div>
        </div>

        {/* Scroll helper indicator overlay over the bottom block */}
        {!hasScrolled && (
          <div className="absolute -top-6 left-0 right-0 flex justify-center w-full pointer-events-none z-[1100] lg:hidden">
            <svg width="40" height="10" viewBox="0 0 60 15" fill="none" className="animate-bounce opacity-70 drop-shadow-lg" style={{ animationDuration: '2s' }}>
              <path d="M2 2L30 12L58 2" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        )}
      </div>

      <style jsx>{`
        .disable-default-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .disable-default-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .disable-default-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .disable-default-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.1) transparent;
        }
      `}</style>
    </div>
  );
}
