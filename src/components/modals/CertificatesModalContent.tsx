import Image from "next/image";
import { useState } from "react";

function OrderButton({ isMobile }: { isMobile: boolean }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="relative w-full max-w-[300px] mx-auto">
            {/* Social Buttons Layer */}
            <div className={`absolute bottom-[calc(100%+12px)] left-0 right-0 flex justify-evenly transition-all duration-500 ease-out origin-bottom ${isMenuOpen ? "opacity-100 scale-100 translate-y-0 z-50 pointer-events-auto" : "opacity-0 scale-50 translate-y-4 z-[-1] pointer-events-none"}`}>
                <a href="http://t.me/zzzhekichannnn" target="_blank" rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex h-14 w-14 items-center justify-center rounded-full border border-white/30 bg-black/20 backdrop-blur-md transition-all hover:scale-110 active:scale-95"
                >
                    <Image src="/Telegram_logo.svg.webp" alt="TG" width={32} height={32} className="object-contain"  unoptimized />
                </a>
                <a href="https://www.instagram.com/jekki.jane.art/" target="_blank" rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex h-14 w-14 items-center justify-center rounded-full border border-white/30 bg-black/20 backdrop-blur-md transition-all hover:scale-110 active:scale-95"
                >
                    <Image src="/Instagram_icon.webp" alt="IG" width={32} height={32} className="object-contain"  unoptimized />
                </a>
                <a href="https://vk.ru/id437361077" target="_blank" rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex h-14 w-14 items-center justify-center rounded-full border border-white/30 bg-black/20 backdrop-blur-md transition-all hover:scale-110 active:scale-95"
                >
                    <Image src="/vk-logo.webp" alt="VK" width={32} height={32} className="object-contain"  unoptimized />
                </a>
            </div>

            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    setIsMenuOpen(!isMenuOpen);
                }}
                className={`w-full py-2.5 rounded-xl bg-gradient-to-r from-[#A01648]/90 to-[#CD2664]/90 border border-white/30 text-white font-bold tracking-wider transition-all hover:brightness-110 active:scale-[0.98] shadow-lg ${isMobile ? 'text-sm' : 'text-base'}`}
                style={{ fontFamily: "Comfortaa, sans-serif" }}
            >
                {isMenuOpen ? 'НАПИШИ МНЕ' : 'ЗАКАЗАТЬ'}
            </button>
        </div>
    );
}

export function CertificatesModalContent() {
    return (
        <div className="space-y-4 text-sm leading-relaxed" style={{ fontFamily: "Comfortaa, sans-serif" }}>
            <p className="font-semibold text-base mb-2">Подарочный сертификат:</p>

            <p className="whitespace-pre-line ml-4" style={{ fontWeight: 300 }}>{` - на любую услугу
 - на любую сумму`}</p>

            <p className="mt-4" style={{ fontWeight: 300 }}>Возможен электронный и печатный формат</p>

            <p className="mt-4">
                <span style={{ fontWeight: 300 }}>Срок действия: </span>
                <span className="font-semibold">1 год</span>
            </p>

            <div className="my-8">
                <OrderButton isMobile={false} />
            </div>

            <Image src="/sertificates/1.webp" alt="Подарочный сертификат" width={520} height={520} className="h-auto w-full rounded-lg"  unoptimized />
        </div>
    );
}
