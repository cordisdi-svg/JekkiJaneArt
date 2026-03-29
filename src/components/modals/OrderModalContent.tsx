import Image from "next/image";
import { useState } from "react";

const links = [
  { icon: "/Telegram_logo.svg.webp", href: "http://t.me/zzzhekichannnn", label: "Telegram" },
  { icon: "/Instagram_icon.webp", href: "https://www.instagram.com/jekki.jane.art/", label: "Instagram" },
  { icon: "/vk-logo.webp", href: "https://vk.ru/id437361077", label: "VK" }
];

function CopyButton({ textToCopy }: { textToCopy: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) { }
  };

  return (
    <button
      onClick={handleCopy}
      title="Копировать"
      className="ml-2 flex flex-shrink-0 items-center justify-center h-[26px] w-[26px] rounded bg-transparent hover:bg-white/10 transition-colors"
      aria-label="Копировать"
    >
      {copied ? (
        <svg viewBox="0 0 24 24" className="h-[14px] w-[14px] fill-white"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>
      ) : (
        <svg viewBox="0 0 24 24" className="h-[14px] w-[14px] fill-white"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" /></svg>
      )}
    </button>
  );
}

export function OrderModalContent() {
  return (
    <div className="space-y-4 text-sm leading-relaxed" style={{ fontFamily: "Comfortaa, sans-serif" }}>

      <div>
        <p className="font-semibold text-center mb-2 text-[15px]">Чтобы оформить заказ, просто свяжитесь со мной удобным способом:</p>
        <div className="flex flex-col items-center gap-1" style={{ fontWeight: 300 }}>
          <div className="flex items-center justify-center">
            <span>Telegram: @zzzhekichannnn</span>
            <CopyButton textToCopy="@zzzhekichannnn" />
          </div>
          <div className="flex items-center justify-center">
            <span>Instagram: @JEKKI.JANE.ART</span>
            <CopyButton textToCopy="@JEKKI.JANE.ART" />
          </div>
          <div className="flex items-center justify-center">
            <span>WhatsApp: 8 925 919-88-46</span>
            <CopyButton textToCopy="8 925 919-88-46" />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 py-1">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            aria-label={link.label}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-black/20 backdrop-blur-sm transition-colors hover:bg-black/30"
          >
            <Image src={link.icon} alt="" width={28} height={28}  unoptimized />
          </a>
        ))}
      </div>

      <div>
        <p className="font-semibold mb-2 text-[15px]">Далее всё просто:</p>
        <p className="whitespace-pre-line" style={{ fontWeight: 300 }}>{`Напишите мне в Direct / Telegram / WhatsApp
Опишите ваш запрос (идея, размер, формат, пожелания)
Мы согласуем детали и сроки`}</p>
      </div>

      <div>
        <p className="font-semibold mb-2 text-[15px]">Доставка:</p>
        <p className="whitespace-pre-line" style={{ fontWeight: 300 }}>{`По России — СДЭК / Почта
Международная доставка — по запросу
Самовывоз — по договоренности
Картины упаковываются в защитную пленку и коробку.`}</p>
      </div>

    </div>
  );
}
