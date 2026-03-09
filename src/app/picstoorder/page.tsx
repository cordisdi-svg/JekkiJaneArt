"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { PageBackground } from "@/components/layout/PageBackground";
import { PicsToOrderMarquee } from "@/components/carousel/PicsToOrderMarquee";

// ─── data ──────────────────────────────────────────────────────────────────
const BUTTONS = [
    {
        id: "order",
        label: "Что вы можете заказать?",
        text: `– интерьерную картину
– портрет
– копию понравившейся работы
– авторскую композицию с нуля
– картину под стиль бренда / заведения
– серию картин для пространства
– или что-то другое — спросите!`,
    },
    {
        id: "process",
        label: "Как проходит работа?",
        text: `– Обсуждение запроса (идея, стиль, размеры, цветовая палитра)
– Подбор референсов и визуальной концепции
– Утверждение композиции
– Процесс создания
– Финальные правки (при необходимости)
– Передача работы заказчику`,
    },
    {
        id: "price",
        label: "Стоимость и сроки",
        text: `– 20×20 см — от 3 000 руб
– 30×30 см — от 7 000 руб
– 50×70 см — от 15 000 руб
– 70×100 см — от 25 000 руб
– 120×200 см — от 35 000 руб
– Индивидуальный размер — по запросу

Стоимость зависит от:
— сложности работы
— количества деталей
— сроков
— используемых материалов

Срок выполнения: от 3 дней`,
    },
    {
        id: "sizes",
        label: "Шпаргалка по размерам",
        text: null,
    },
] as const;

type ButtonId = (typeof BUTTONS)[number]["id"];

// Nav color (matches BottomNavigation)
const NAV_BG = "rgba(30,22,40,0.82)";
const NAV_BLUR = "blur(14px) saturate(1.4)";

// ─── desktop accordion panel ────────────────────────────────────────────────
function DesktopPanel({
    text,
    buttonRef,
    onCollapseDone,
    closing,
}: {
    text: string;
    buttonRef: React.RefObject<HTMLButtonElement | null>;
    onCollapseDone: () => void;
    closing: boolean;
}) {
    const [style, setStyle] = useState<React.CSSProperties>({});
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (!buttonRef.current) return;
        const rect = buttonRef.current.getBoundingClientRect();
        setStyle({
            position: "fixed",
            left: rect.left,
            top: rect.bottom + 8,
            width: rect.width,
        });
        // animate in next frame
        const id = requestAnimationFrame(() => setVisible(true));
        return () => cancelAnimationFrame(id);
    }, [buttonRef]);

    // when closing prop flips, collapse and notify parent when done
    useEffect(() => {
        if (!closing) return;
        setVisible(false);
    }, [closing]);

    return (
        <div
            style={{
                ...style,
                maxHeight: visible ? "640px" : "0",
                overflow: "hidden",
                // same easing for open and close, +30% slower = 0.52s
                transition: "max-height 0.52s cubic-bezier(0.4,0,0.2,1)",
                zIndex: 40,
            }}
            onTransitionEnd={() => {
                if (closing) onCollapseDone();
            }}
            className="rounded-xl"
        >
            <div
                className="rounded-xl p-5 shadow-xl border border-white/15 whitespace-pre-line"
                style={{
                    background: NAV_BG,
                    backdropFilter: NAV_BLUR,
                    WebkitBackdropFilter: NAV_BLUR,
                    color: "rgba(255,255,255,0.92)",
                    fontFamily: "Comfortaa, sans-serif",
                    fontSize: "17px",
                    lineHeight: "1.4",
                }}
            >
                {text}
                {text.includes("Срок выполнения") && (
                    <div className="mt-6 pt-4 border-t border-white/10">
                        <OrderButton isMobile={false} />
                    </div>
                )}
            </div>
        </div>
    );
}

function OrderButton({ isMobile }: { isMobile: boolean }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="relative w-full">
            {/* Social Buttons Layer */}
            <div className={`absolute bottom-[calc(100%+12px)] left-1/2 -translate-x-1/2 flex gap-3 transition-all duration-500 ease-out origin-bottom ${isMenuOpen ? "opacity-100 scale-100 translate-y-0 z-50 pointer-events-auto" : "opacity-0 scale-50 translate-y-4 z-[-1] pointer-events-none"}`}>
                <a href="http://t.me/jinnyji" target="_blank" rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/20 backdrop-blur-md transition-all hover:scale-110 active:scale-95"
                >
                    <Image src="/Telegram_logo.svg.png" alt="TG" width={22} height={22} className="object-contain" />
                </a>
                <a href="https://www.instagram.com/jekki.jane.art/" target="_blank" rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/20 backdrop-blur-md transition-all hover:scale-110 active:scale-95"
                >
                    <Image src="/Instagram_icon.png" alt="IG" width={20} height={20} className="object-contain" />
                </a>
                <a href="https://vk.ru/id437361077" target="_blank" rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/20 backdrop-blur-md transition-all hover:scale-110 active:scale-95"
                >
                    <Image src="/vk-logo.png" alt="VK" width={22} height={22} className="object-contain" />
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

// ─── sizes lightbox ─────────────────────────────────────────────────────────
function SizesLightbox({ onClose }: { onClose: () => void }) {
    useEffect(() => {
        document.body.classList.add("overlay-open");
        return () => document.body.classList.remove("overlay-open");
    }, []);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md cursor-pointer p-4"
            onClick={onClose}
        >
            <Image
                src="/picstoorder/sizes.png"
                alt="Шпаргалка по размерам"
                width={1200}
                height={900}
                className="max-h-[90vh] max-w-[90vw] w-auto h-auto object-contain rounded-xl shadow-2xl"
                priority
            />
        </div>
    );
}

// ─── page ───────────────────────────────────────────────────────────────────
export default function PicsToOrderPage() {
    // desktopOpen = currently shown panel id
    // desktopClosing = panel that is mid-collapse animation
    const [desktopOpen, setDesktopOpen] = useState<ButtonId | null>(null);
    const [desktopClosing, setDesktopClosing] = useState<ButtonId | null>(null);
    const [mobileOpen, setMobileOpen] = useState<ButtonId | null>(null);
    const [showSizes, setShowSizes] = useState(false);

    const btnRefs = useRef<Record<string, React.RefObject<HTMLButtonElement | null>>>({});
    BUTTONS.forEach((b) => {
        if (!btnRefs.current[b.id]) {
            btnRefs.current[b.id] = { current: null };
        }
    });

    // Desktop: close with animation then optionally open new one
    const openDesktop = (id: ButtonId | null) => {
        if (desktopOpen) {
            setDesktopClosing(desktopOpen);
            // store what to open after collapse (use a ref trick via a closure)
            _pendingOpen.current = id;
        } else {
            setDesktopOpen(id);
        }
    };
    const _pendingOpen = useRef<ButtonId | null>(null);

    const handleCollapseComplete = () => {
        setDesktopOpen(null);
        setDesktopClosing(null);
        if (_pendingOpen.current) {
            setDesktopOpen(_pendingOpen.current);
            _pendingOpen.current = null;
        }
    };

    const handleDesktopClick = (id: ButtonId) => {
        if (id === "sizes") {
            openDesktop(null);
            setShowSizes(true);
            return;
        }
        if (desktopOpen === id) {
            openDesktop(null); // close current
        } else {
            openDesktop(id);
        }
    };

    const handleMobileClick = (id: ButtonId) => {
        if (id === "sizes") {
            setMobileOpen(null);
            setShowSizes(true);
            return;
        }
        setMobileOpen((prev) => (prev === id ? null : id));
    };

    const activeDesktopBtn = BUTTONS.find((b) => b.id === (desktopOpen ?? desktopClosing));
    const activeMobileBtn = BUTTONS.find((b) => b.id === mobileOpen);

    // button bar height in percent of active zone (excluding nav)
    const BTN_BAR_PCT = 12;

    return (
        <PageBackground backgroundSrc="/mainpage/mainpage-back.png">
            {showSizes && <SizesLightbox onClose={() => setShowSizes(false)} />}

            {/* Google Font already loaded in layout.tsx via Playfair Display */}
            <style>{`
        @keyframes pto-pulse {
          0%   { transform: scale(0.93); }
          50%  { transform: scale(1.00); }
          100% { transform: scale(0.93); }
        }
      `}</style>

            <div className="relative flex h-svh w-full flex-col overflow-hidden">

                {/* ── Carousel: starts at button-bar bottom edge on desktop, top on mobile ── */}
                <div
                    className="absolute left-0 right-0 pointer-events-none"
                    style={{
                        /* desktop: top pushed down below button bar */
                        top: `calc(${BTN_BAR_PCT}% + 0px)`,
                        bottom: "var(--nav-height)",
                    }}
                >
                    {/* on mobile we want the carousel from the very top, so override */}
                    <div
                        className="w-full h-full"
                        style={{
                            /* mobile: push top back to 0 via negative margin trick isn't possible with absolute.
                               Instead we wrap the marquee in a full-height container and on mobile
                               we add overflow so it bleeds up visually. */
                        }}
                    >
                        <PicsToOrderMarquee />
                    </div>
                </div>
                {/* Mobile: carousel covers whole active zone (buttons overlay on top) */}
                <div
                    className="absolute left-0 right-0 pointer-events-none lg:hidden"
                    style={{ top: 0, bottom: "var(--nav-height-mobile)" }}
                >
                    <PicsToOrderMarquee />
                </div>

                {/* ════════════════════════════════════════════════
            DESKTOP LAYOUT  (lg and up)
        ════════════════════════════════════════════════ */}

                {/* Button bar — top BTN_BAR_PCT% of active zone */}
                <div
                    className="absolute left-0 right-0 top-0 z-20 hidden lg:flex gap-4 px-4"
                    style={{ height: `${BTN_BAR_PCT}%`, paddingTop: "10px", paddingBottom: "10px" }}
                >
                    {BUTTONS.map((btn) => {
                        const isActive = desktopOpen === btn.id || desktopClosing === btn.id;
                        return (
                            <button
                                key={btn.id}
                                ref={btnRefs.current[btn.id] as React.RefObject<HTMLButtonElement>}
                                onClick={() => handleDesktopClick(btn.id)}
                                className="flex-1 flex items-center justify-between gap-3 px-4
                           border border-white/20 rounded-xl
                           text-white/90 select-none
                           transition-colors duration-200 hover:brightness-110"
                                style={{
                                    background: NAV_BG,
                                    backdropFilter: NAV_BLUR,
                                    WebkitBackdropFilter: NAV_BLUR,
                                }}
                            >
                                {/* Label: takes up remaining space, centered within itself */}
                                <span
                                    className="flex-1 text-center leading-snug"
                                    style={{ fontFamily: "Abibas, serif", fontSize: "22px" }}
                                >
                                    {btn.label}
                                </span>
                                {/* Arrow: fixed right zone */}
                                <span
                                    className="flex-shrink-0 w-[15%] flex items-center justify-center opacity-70 transition-transform duration-500"
                                    style={{ transform: isActive ? "rotate(180deg)" : "rotate(0deg)" }}
                                >
                                    ▼
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Desktop accordion panel */}
                {(desktopOpen || desktopClosing) && activeDesktopBtn?.text && (
                    <DesktopPanel
                        key={desktopOpen ?? desktopClosing}
                        text={activeDesktopBtn.text}
                        buttonRef={btnRefs.current[(desktopOpen ?? desktopClosing)!] as React.RefObject<HTMLButtonElement | null>}
                        closing={!!desktopClosing}
                        onCollapseDone={handleCollapseComplete}
                    />
                )}

                {/* ════════════════════════════════════════════════
            MOBILE LAYOUT  (below lg)
        ════════════════════════════════════════════════ */}

                {/* Right column — 30% width, round buttons */}
                <div
                    className="absolute right-0 top-0 z-20 flex lg:hidden flex-col"
                    style={{
                        width: "30%",
                        bottom: "var(--nav-height-mobile)",
                        padding: "10px 8px",
                        gap: 0,
                        justifyContent: "space-around",
                    }}
                >
                    {BUTTONS.map((btn) => {
                        const isActive = mobileOpen === btn.id;
                        return (
                            <button
                                key={btn.id}
                                onClick={() => handleMobileClick(btn.id)}
                                className="relative rounded-full border text-white/90 text-[11px] text-center px-2 select-none"
                                style={{
                                    animationName: isActive ? "none" : "pto-pulse",
                                    animationDuration: "3s",
                                    animationTimingFunction: "ease-in-out",
                                    animationIterationCount: "infinite",
                                    transform: isActive ? "scale(1.0)" : undefined,
                                    transition: "transform 0.3s ease, background 0.3s ease",
                                    aspectRatio: "1/1",
                                    background: isActive
                                        ? "rgba(55,38,70,0.90)"    // slightly brighter than nav
                                        : NAV_BG,
                                    borderColor: isActive ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.20)",
                                    backdropFilter: NAV_BLUR,
                                    WebkitBackdropFilter: NAV_BLUR,
                                    fontFamily: "Abibas, serif",
                                    fontSize: "15px",
                                    lineHeight: "1.35",
                                }}
                            >
                                <span className="block">{btn.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Mobile text panel — height = fit-content (auto, not full-height) */}
                {mobileOpen && (
                    <div
                        className="absolute z-30 lg:hidden"
                        style={{
                            left: "16px",
                            right: "calc(30% + 16px)",
                            top: "16px",
                            maxHeight: "calc(100svh - var(--nav-height-mobile) - 32px)",
                            overflowY: "auto",
                        }}
                    >
                        <div
                            className="w-full rounded-xl border border-white/15 shadow-xl"
                            style={{
                                background: "rgba(20,14,30,0.82)",
                                backdropFilter: NAV_BLUR,
                                WebkitBackdropFilter: NAV_BLUR,
                            }}
                            onClick={() => setMobileOpen(null)}
                        >
                            <div
                                style={{
                                    padding: "16px",
                                    color: "rgba(255,255,255,0.92)",
                                    fontFamily: "Comfortaa, sans-serif",
                                    fontSize: "15px",
                                    lineHeight: "1.4",
                                }}
                            >
                                {activeMobileBtn?.id === "sizes" ? (
                                    <Image
                                        src="/picstoorder/sizes.png"
                                        alt="Шпаргалка по размерам"
                                        width={600}
                                        height={400}
                                        className="w-full h-auto rounded-lg"
                                    />
                                ) : (
                                    <>
                                        <p className="whitespace-pre-line m-0 mb-4">{activeMobileBtn?.text}</p>
                                        {activeMobileBtn?.id === "price" && (
                                            <div className="mt-4 pt-4 border-t border-white/10">
                                                <OrderButton isMobile={true} />
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </PageBackground >
    );
}
