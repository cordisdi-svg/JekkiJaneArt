import Image from "next/image";

const links = [
  { icon: "/Telegram_logo.svg.png", href: "http://t.me/jinnyji", label: "Telegram" },
  { icon: "/Instagram_icon.png", href: "https://www.instagram.com/jekki.jane.art/", label: "Instagram" },
  { icon: "/vk-logo.png", href: "https://vk.ru/id437361077", label: "VK" }
];

export function OrderModalContent() {
  return (
    <div className="space-y-4 text-sm leading-relaxed">
      <p className="whitespace-pre-line">{`Чтобы оформить заказ, просто свяжитесь со мной удобным способом:
Telegram: @jinnyji
Instagram: @JEKKI.JANE.ART
WhatsApp / Телефон: 8 925 919-88-46`}</p>
      <div className="flex items-center justify-center gap-4">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            aria-label={link.label}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-black/20 backdrop-blur-sm transition-colors hover:bg-black/30"
          >
            <Image src={link.icon} alt="" width={28} height={28} />
          </a>
        ))}
      </div>
      <p className="whitespace-pre-line">{`Далее всё просто:
Напишите мне в Direct / Telegram / WhatsApp
Опишите ваш запрос (идея, размер, формат, пожелания)
Мы согласуем детали и сроки

Доставка:
По России — СДЭК / Почта
Международная доставка — по запросу
Самовывоз — по договоренности
Картины упаковываются в защитную пленку и коробку.`}</p>
    </div>
  );
}
