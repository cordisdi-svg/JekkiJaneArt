"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";

const links = [
  { icon: "/Telegram_logo.svg.webp", href: "https://t.me/magimist", label: "Telegram создателя сайта" },
  { icon: "/Instagram_icon.webp", href: "https://www.instagram.com/magistr_iney", label: "Instagram создателя сайта" }
];

export function SiteCreatorModalContent() {
  const [hasScrolled, setHasScrolled] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollParent = rootRef.current?.closest('.overflow-y-auto');
    if (!scrollParent) return;

    const handleScroll = () => {
      if (scrollParent.scrollTop > 5) {
        setHasScrolled(true);
      }
    };

    scrollParent.addEventListener('scroll', handleScroll, { passive: true });
    return () => scrollParent.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={rootRef} className="flex flex-col gap-4 text-sm leading-relaxed" style={{ fontFamily: "Comfortaa, sans-serif" }}>

      <div className="order-1 text-center lg:mb-2">
        <p className="font-semibold text-base mb-1">Web-разработка:</p>
        <p className="font-semibold text-[15px]">Сайт, который отражает именно ваш продукт</p>
      </div>

      <div className="order-2 lg:order-4 bg-white/5 rounded-xl p-3 text-center border border-white/10 shadow-sm mt-1 lg:mt-4 lg:mb-0 mb-2">
        <p className="font-semibold text-[15px] mb-3 text-[#A01648] brightness-150 drop-shadow-[0_0_8px_rgba(205,38,100,0.6)]">
          На данный момент действует скидка!
        </p>

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
              <Image src={link.icon} alt="" width={28} height={28} className="object-contain"  unoptimized />
            </a>
          ))}
        </div>
      </div>

      <p className="order-3 lg:order-2" style={{ fontWeight: 300 }}>
        Бизнес, портфолио, личный проект - создаётся с <span className="font-semibold">глубоким пониманием цели</span> продукта и индивидуальным стилем вместо шаблонных решений. Раскрываю сильные стороны вашего продукта, делаю акцент на бизнес-эффективности и узнаваемости бренда.
      </p>

      <ul className="order-4 lg:order-3 space-y-3 pl-2" style={{ fontWeight: 300 }}>
        <li className="flex gap-2">
          <span className="font-semibold mt-[2px] text-white/70">•</span>
          <span>Разбираемся с целью, ожиданиями от дизайна, находим решения отличающие вас от остальных - помогаю формулировать ваш запрос</span>
        </li>
        <li className="flex gap-2">
          <span className="font-semibold mt-[2px] text-white/70">•</span>
          <span>Анализ конкурентов, удачных решений на рынке - ищем оптимальный формат под вас</span>
        </li>
        <li className="flex gap-2">
          <span className="font-semibold mt-[2px] text-white/70">•</span>
          <span>В процессе работы смотрим на прототип, корректируем под ваше видение</span>
        </li>
        <li className="flex gap-2">
          <span className="font-semibold mt-[2px] text-white/70">•</span>
          <span>Вносим правки перед финализацией</span>
        </li>
        <li className="flex gap-2">
          <span className="font-semibold mt-[2px] text-white/70">•</span>
          <span>Полное соответствие актуальному законодательству</span>
        </li>
        <li className="flex gap-2">
          <span className="font-semibold mt-[2px] text-white/70">•</span>
          <span>Поддержка после передачи готового продукта</span>
        </li>
      </ul>

      {/* Downward scrolling arrow for mobile only */}
      {!hasScrolled && (
        <div className="order-5 lg:hidden fixed bottom-4 left-0 right-0 flex justify-center w-full pointer-events-none z-[1100]">
          <svg width="50" height="12" viewBox="0 0 60 15" fill="none" className="animate-bounce opacity-60 drop-shadow-lg" style={{ animationDuration: '2s' }}>
            <path d="M2 2L30 12L58 2" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      )}

    </div>
  );
}
