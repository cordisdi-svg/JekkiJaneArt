import Image from "next/image";

const links = [
  { icon: "/Telegram_logo.svg.png", href: "https://t.me/magimist", label: "Telegram создателя сайта" },
  { icon: "/Instagram_icon.png", href: "https://www.instagram.com/magistr_iney", label: "Instagram создателя сайта" }
];

export function SiteCreatorModalContent() {
  return (
    <div className="space-y-4 text-sm leading-relaxed" style={{ fontFamily: "Comfortaa, sans-serif" }}>

      <div className="text-center mb-6">
        <p className="font-semibold text-base mb-1">Web-разработка:</p>
        <p className="font-semibold text-[15px]">Сайт, который отражает именно ваш продукт</p>
      </div>

      <p style={{ fontWeight: 300 }}>
        Бизнес, портфолио, личный проект - создаётся с <span className="font-semibold">глубоким пониманием цели</span> продукта и индивидуальным стилем вместо шаблонных решений. Раскрываю сильные стороны вашего продукта, делаю акцент на бизнес-эффективности и узнаваемости бренда.
      </p>

      <ul className="space-y-3 pl-2 mt-4" style={{ fontWeight: 300 }}>
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

      <div className="bg-white/5 rounded-xl p-3 text-center border border-white/10 mt-4 shadow-sm">
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
              className="flex h-[48px] w-[48px] items-center justify-center rounded-full border border-white/20 bg-black/30 backdrop-blur-md transition-transform hover:scale-110 active:scale-95 shadow-md"
            >
              <Image src={link.icon} alt="" width={28} height={28} className="object-contain" />
            </a>
          ))}
        </div>
      </div>

    </div>
  );
}
