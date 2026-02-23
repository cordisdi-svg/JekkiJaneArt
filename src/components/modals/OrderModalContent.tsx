import Image from "next/image";

const linkClass =
  "flex h-12 w-12 items-center justify-center rounded-full border border-[var(--border)] bg-white transition hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]";

export function OrderModalContent() {
  return (
    <div className="space-y-5 text-sm leading-6 text-[var(--text)]">
      <p>
        Чтобы оформить заказ, просто свяжитесь со мной удобным способом:
        <br />
        Telegram: @zzzhekichannnn
        <br />
        Instagram: @JEKKI.JANE.ART
        <br />
        WhatsApp / Телефон: 8 925 919-88-46
      </p>

      <div className="flex items-center gap-3">
        <a
          href="https://t.me/zzzhekichannnn"
          target="_blank"
          rel="noreferrer"
          className={linkClass}
          aria-label="Написать в Telegram"
        >
          <Image src="/Telegram_logo.svg.png" alt="Telegram" width={28} height={28} />
        </a>
        <a
          href="https://www.instagram.com/jekki.jane.art"
          target="_blank"
          rel="noreferrer"
          className={linkClass}
          aria-label="Открыть Instagram"
        >
          <Image src="/Instagram_icon.png" alt="Instagram" width={28} height={28} />
        </a>
        <a
          href="https://vk.ru/id437361077"
          target="_blank"
          rel="noreferrer"
          className={linkClass}
          aria-label="Открыть VK"
        >
          <Image src="/vk-logo.png" alt="VK" width={28} height={28} />
        </a>
      </div>

      <div className="space-y-2">
        <p>Далее всё просто:</p>
        <ul className="list-inside list-disc space-y-1 text-[var(--muted)]">
          <li>Напишите мне в Direct / Telegram / WhatsApp</li>
          <li>Опишите ваш запрос (идея, размер, формат, пожелания)</li>
          <li>Мы согласуем детали и сроки</li>
        </ul>
      </div>

      <div className="space-y-2">
        <p>Доставка:</p>
        <ul className="list-inside list-disc space-y-1 text-[var(--muted)]">
          <li>По России — СДЭК / Почта</li>
          <li>Международная доставка — по запросу</li>
          <li>Самовывоз — по договоренности</li>
        </ul>
        <p>Картины упаковываются в защитную пленку и коробку.</p>
      </div>
    </div>
  );
}
