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
        text: `- интерьерную картину
- портрет
- копию понравившейся работы
- авторскую композицию с нуля
- картину под стиль бренда / заведения
- серию картин для пространства
- или что-то другое — спросите!`,
    },
    {
        id: "process",
        label: "Как проходит работа?",
        text: `- Обсуждение запроса (идея, стиль, размеры, цветовая палитра)
- Подбор референсов и визуальной концепции
- Утверждение композиции
- Процесс создания
- Финальные правки (при необходимости)
- Передача работы заказчику`,
    },
    {
        id: "price",
        label: "Стоимость и сроки",
        text: `- 20×20 см — от 3 000 руб
- 30×30 см — от 7 000 руб
- 50×70 см — от 15 000 руб
- 70×100 см — от 25 000 руб
- 120×200 см — от 35 000 руб
- Индивидуальный размер — по запросу

Стоимость зависит от:
- сложности работы
- количества деталей
- сроков
- используемых материалов

Срок выполнения: от 3 дней`,
    },
    {
        id: "sizes",
        label: "Шпаргалка по размерам",
        text: null, // opens lightbox
    },
] as const;

type ButtonId = (typeof BUTTONS)[number]["id"];

// ─── desktop accordion panel ────────────────────────────────────────────────
function DesktopPanel({
    text,
    buttonRef,
}: {
    text: string;
    buttonRef: React.RefObject<HTMLButtonElement | null>;
}) {
    const panelRef = useRef<HTMLDivElement>(null);
    const [style, setStyle] = useState<React.CSSProperties>({});

    useEffect(() => {
        if (!buttonRef.current) return;
        const rect = buttonRef.current.getBoundingClientRect();
        setStyle({
            position: "fixed",
            left: rect.left,
            top: rect.bottom + 8,
            width: rect.width,
        });
    }, [buttonRef]);

    // animate in via max-height
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const id = requestAnimationFrame(() => setVisible(true));
        return () => cancelAnimationFrame(id);
    }, []);

    return (
        <div
            ref={panelRef}
            style={{
                ...style,
                maxHeight: visible ? "600px" : "0",
                overflow: "hidden",
                transition: "max-height 0.4s cubic-bezier(0.4,0,0.2,1)",
                zIndex: 40,
            }}
            className="rounded-xl"
        >
            <div className="bg-black/25 backdrop-blur-md border border-white/15 rounded-xl p-4 text-white/90 text-sm leading-relaxed whitespace-pre-line shadow-xl">
                {text}
            </div>
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
    const [desktopOpen, setDesktopOpen] = useState<ButtonId | null>(null);
    const [mobileOpen, setMobileOpen] = useState<ButtonId | null>(null);
    const [showSizes, setShowSizes] = useState(false);

    // refs for each desktop button so we can position panels beneath them
    const btnRefs = useRef<Record<string, React.RefObject<HTMLButtonElement | null>>>({});
    BUTTONS.forEach((b) => {
        if (!btnRefs.current[b.id]) {
            btnRefs.current[b.id] = { current: null };
        }
    });

    // Desktop button click
    const handleDesktopClick = (id: ButtonId) => {
        if (id === "sizes") {
            setDesktopOpen(null);
            setShowSizes(true);
            return;
        }
        setDesktopOpen((prev) => (prev === id ? null : id));
    };

    // Mobile button tap
    const handleMobileClick = (id: ButtonId) => {
        if (id === "sizes") {
            setMobileOpen(null);
            setShowSizes(true);
            return;
        }
        setMobileOpen((prev) => (prev === id ? null : id));
    };

    const activeDesktopBtn = BUTTONS.find((b) => b.id === desktopOpen);
    const activeMobileBtn = BUTTONS.find((b) => b.id === mobileOpen);

    return (
        <PageBackground backgroundSrc="/mainpage/mainpage-back.png">
            {showSizes && <SizesLightbox onClose={() => setShowSizes(false)} />}

            <div className="relative flex h-[100svh] w-full flex-col overflow-hidden">
                {/* ── Carousel background ── */}
                <div
                    className="absolute top-0 left-0 right-0 pointer-events-none"
                    style={{
                        bottom: "var(--nav-height)",
                    }}
                >
                    <PicsToOrderMarquee />
                </div>

                {/* ════════════════════════════════════════════════
            DESKTOP LAYOUT  (lg and up)
        ════════════════════════════════════════════════ */}

                {/* Button bar — top 12% of active zone */}
                <div
                    className="absolute left-0 right-0 top-0 z-20 hidden lg:flex gap-4 px-4"
                    style={{ height: "calc(12% - var(--nav-height-desktop) * 0)", paddingTop: "12px", paddingBottom: "12px" }}
                >
                    {BUTTONS.map((btn) => (
                        <button
                            key={btn.id}
                            ref={btnRefs.current[btn.id] as React.RefObject<HTMLButtonElement>}
                            onClick={() => handleDesktopClick(btn.id)}
                            className="flex-1 flex items-center justify-between gap-2 px-4
                         bg-white/12 hover:bg-white/20 active:bg-white/25
                         backdrop-blur-md border border-white/20
                         rounded-xl text-white/90 text-sm font-medium
                         transition-colors duration-200 select-none"
                        >
                            <span className="text-left leading-tight">{btn.label}</span>
                            <span
                                className="flex-shrink-0 w-[15%] flex items-center justify-center opacity-70 transition-transform duration-300"
                                style={{
                                    transform: desktopOpen === btn.id ? "rotate(180deg)" : "rotate(0deg)",
                                }}
                            >
                                ▼
                            </span>
                        </button>
                    ))}
                </div>

                {/* Desktop accordion panel */}
                {desktopOpen && activeDesktopBtn?.text && (
                    <DesktopPanel
                        key={desktopOpen}
                        text={activeDesktopBtn.text}
                        buttonRef={btnRefs.current[desktopOpen] as React.RefObject<HTMLButtonElement | null>}
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
                        padding: "12px 8px",
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
                                className="relative rounded-full border border-white/25 text-white/90 text-[10px] font-medium text-center leading-tight px-2 select-none"
                                style={{
                                    animationName: isActive ? "none" : "pto-pulse",
                                    animationDuration: "3s",
                                    animationTimingFunction: "ease-in-out",
                                    animationIterationCount: "infinite",
                                    transform: isActive ? "scale(1.05)" : undefined,
                                    transition: "transform 0.3s ease",
                                    aspectRatio: "1/1",
                                    background: isActive
                                        ? "rgba(255,255,255,0.22)"
                                        : "rgba(255,255,255,0.13)",
                                    backdropFilter: "blur(10px)",
                                    WebkitBackdropFilter: "blur(10px)",
                                }}
                            >
                                <span className="block">{btn.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Mobile text panel */}
                {mobileOpen && (
                    <div
                        className="absolute top-0 z-30 lg:hidden"
                        style={{
                            left: "16px",          // gap-4 from left edge
                            // gap-2 (8px) from the button zone border (30% - 8px right gap)
                            right: "calc(30% + 8px + 8px)", // 8px from button zone + gap-4 right padding
                            bottom: "var(--nav-height-mobile)",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "flex-start",
                            paddingTop: "16px",
                            paddingBottom: "16px",
                        }}
                    >
                        <div
                            className="w-full h-full rounded-xl border border-white/15 shadow-xl overflow-y-auto"
                            style={{
                                background: "rgba(0,0,0,0.25)",
                                backdropFilter: "blur(12px)",
                                WebkitBackdropFilter: "blur(12px)",
                            }}
                            onClick={() => setMobileOpen(null)}
                        >
                            <div className="p-4 text-white/90 text-xs leading-relaxed">
                                {activeMobileBtn?.id === "sizes" ? (
                                    <Image
                                        src="/picstoorder/sizes.png"
                                        alt="Шпаргалка по размерам"
                                        width={600}
                                        height={400}
                                        className="w-full h-auto rounded-lg"
                                    />
                                ) : (
                                    <p className="whitespace-pre-line">{activeMobileBtn?.text}</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Keyframes for mobile pulse — injected via style tag */}
                <style>{`
          @keyframes pto-pulse {
            0%   { transform: scale(0.95); }
            50%  { transform: scale(1.03); }
            100% { transform: scale(0.95); }
          }
        `}</style>
            </div>
        </PageBackground>
    );
}
