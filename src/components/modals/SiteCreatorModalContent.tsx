import Image from "next/image";

const links = [
  { icon: "/Telegram_logo.svg.png", href: "https://t.me/magimist", label: "Telegram создателя сайта" },
  { icon: "/Instagram_icon.png", href: "https://www.instagram.com/magistr_iney", label: "Instagram создателя сайта" }
];

export function SiteCreatorModalContent() {
  return (
    <div className="space-y-4 text-sm leading-relaxed">
      <p>
        разработка дизайна и создание сайта под любые цели под индивидуальный запрос, адаптация под все устройства,
        быстрое исполнение, демократичные цены, действуют скидки
      </p>
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
    </div>
  );
}
