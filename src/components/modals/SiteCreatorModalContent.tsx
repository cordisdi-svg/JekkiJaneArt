import Image from "next/image";

const linkClass =
  "flex h-12 w-12 items-center justify-center rounded-full border border-[var(--border)] bg-white transition hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]";

export function SiteCreatorModalContent() {
  return (
    <div className="space-y-5 text-sm leading-6">
      <p>
        разработка дизайна и создание сайта под любые цели под индивидуальный запрос, адаптация под все устройства,
        быстрое исполнение, демократичные цены, действуют скидки
      </p>
      <div className="flex items-center gap-3">
        <a href="https://t.me/magimist" target="_blank" rel="noreferrer" className={linkClass} aria-label="Связаться с создателем сайта в Telegram">
          <Image src="/Telegram_logo.svg.png" alt="Telegram" width={28} height={28} />
        </a>
        <a
          href="https://www.instagram.com/magistr_iney"
          target="_blank"
          rel="noreferrer"
          className={linkClass}
          aria-label="Открыть Instagram создателя сайта"
        >
          <Image src="/Instagram_icon.png" alt="Instagram" width={28} height={28} />
        </a>
      </div>
    </div>
  );
}
