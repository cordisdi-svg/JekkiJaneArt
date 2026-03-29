"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { PageBackground } from "@/components/layout/PageBackground";
import { PicsToOrderMarquee } from "@/components/carousel/PicsToOrderMarquee";

// ─── data ──────────────────────────────────────────────────────────────────
import { BUTTONS, type ButtonId } from "@/data/picsToOrderButtons";

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
            <div className={`absolute bottom-[calc(100%+12px)] transition-all duration-500 ease-out origin-bottom ${isMenuOpen ? "opacity-100 scale-100 translate-y-0 z-50 pointer-events-auto" : "opacity-0 scale-50 translate-y-4 z-[-1] pointer-events-none"} ${isMobile ? 'left-1/2 -translate-x-1/2 flex gap-3' : 'left-0 right-0 flex justify-evenly'}`}>
                <a href="http://t.me/jinnyji" target="_blank" rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className={`relative isolate flex items-center justify-center rounded-full border border-white/30 transition-transform hover:scale-110 active:scale-95 ${isMobile ? 'h-10 w-10' : 'h-14 w-14'}
                               before:absolute before:inset-0 before:rounded-full before:backdrop-blur-md before:bg-black/20
                               before:transition-opacity before:duration-[1500ms] before:-z-10 before:pointer-events-none
                               ${isMenuOpen ? 'before:opacity-100' : 'before:opacity-0'}`}
                >
                    <Image src="/Telegram_logo.svg.webp" alt="TG" width={isMobile ? 24 : 32} height={isMobile ? 24 : 32} className="object-contain"  unoptimized />
                </a>
                <a href="https://www.instagram.com/jekki.jane.art/" target="_blank" rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className={`relative isolate flex items-center justify-center rounded-full border border-white/30 transition-transform hover:scale-110 active:scale-95 ${isMobile ? 'h-10 w-10' : 'h-14 w-14'}
                               before:absolute before:inset-0 before:rounded-full before:backdrop-blur-md before:bg-black/20
                               before:transition-opacity before:duration-[1500ms] before:-z-10 before:pointer-events-none
                               ${isMenuOpen ? 'before:opacity-100' : 'before:opacity-0'}`}
                >
                    <Image src="/Instagram_icon.webp" alt="IG" width={isMobile ? 24 : 32} height={isMobile ? 24 : 32} className="object-contain"  unoptimized />
                </a>
                <a href="https://vk.ru/id437361077" target="_blank" rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className={`relative isolate flex items-center justify-center rounded-full border border-white/30 transition-transform hover:scale-110 active:scale-95 ${isMobile ? 'h-10 w-10' : 'h-14 w-14'}
                               before:absolute before:inset-0 before:rounded-full before:backdrop-blur-md before:bg-black/20
                               before:transition-opacity before:duration-[1500ms] before:-z-10 before:pointer-events-none
                               ${isMenuOpen ? 'before:opacity-100' : 'before:opacity-0'}`}
                >
                    <Image src="/vk-logo.webp" alt="VK" width={isMobile ? 24 : 32} height={isMobile ? 24 : 32} className="object-contain"  unoptimized />
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
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md cursor-pointer p-4 pointer-events-auto"
            onPointerDown={(e) => e.stopPropagation()}
            onPointerUp={(e) => e.stopPropagation()}
            onPointerMove={(e) => e.stopPropagation()}
            onPointerCancel={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            onTouchEnd={(e) => e.stopPropagation()}
            onTouchCancel={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            onMouseMove={(e) => e.stopPropagation()}
            onMouseUp={(e) => e.stopPropagation()}
            onWheel={(e) => e.stopPropagation()}
            onClick={(e) => {
                e.stopPropagation();
                onClose();
            }}
        >
            <Image
                src="/picstoorder/sizes.webp"
                alt="Шпаргалка по размерам"
                width={1200}
                height={900}
                className="max-h-[90vh] max-w-[90vw] w-auto h-auto object-contain rounded-xl shadow-2xl relative z-10"
                priority
             unoptimized />
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
        <PageBackground backgroundSrc="/mainpage/mainpage-back.webp">
            {showSizes && <SizesLightbox onClose={() => setShowSizes(false)} />}

            <div className="relative flex h-svh w-full flex-col overflow-hidden">

                {/* ── Carousel: starts at button-bar bottom edge on desktop, top on mobile ── */}
                <div
                    className="absolute left-0 right-0 z-10 hidden md:block pointer-events-none"
                    style={{
                        /* desktop: top pushed down below button bar */
                        top: `calc(${BTN_BAR_PCT}% + 0px)`,
                        bottom: "var(--nav-height)",
                    }}
                >
                    <div className="w-full h-full">
                        <PicsToOrderMarquee />
                    </div>
                </div>
                {/* Mobile: carousel covers whole active zone (buttons overlay on top) is now below in MOBILE LAYOUT section to wrap children */}

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
                                    style={{ fontFamily: "Fontatica4F, sans-serif", fontSize: "25px" }}
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

                <div
                    className="absolute left-0 right-0 md:hidden z-10"
                    style={{ top: 0, bottom: "var(--nav-height-mobile)" }}
                >
                    <PicsToOrderMarquee>
                        {/* Right column — 37.5% width, round buttons */}
                        <div
                            className="absolute right-0 top-0 z-20 flex flex-col pointer-events-auto"
                            onPointerDown={(e) => e.stopPropagation()}
                            onPointerUp={(e) => e.stopPropagation()}
                            onPointerMove={(e) => e.stopPropagation()}
                            onPointerCancel={(e) => e.stopPropagation()}
                            onTouchStart={(e) => e.stopPropagation()}
                            onTouchMove={(e) => e.stopPropagation()}
                            onTouchEnd={(e) => e.stopPropagation()}
                            onTouchCancel={(e) => e.stopPropagation()}
                            onMouseDown={(e) => e.stopPropagation()}
                            onMouseMove={(e) => e.stopPropagation()}
                            onMouseUp={(e) => e.stopPropagation()}
                            onWheel={(e) => e.stopPropagation()}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                width: "37.5%",
                                bottom: 0,
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
                                        className={`relative rounded-full border border-transparent text-white/90 text-[11px] text-center px-2 select-none
                                                   before:absolute before:inset-0 before:rounded-full before:backdrop-blur-md 
                                                   before:opacity-0 group-data-[visible=true]:before:opacity-100 
                                                   before:transition-opacity before:duration-[1500ms] before:pointer-events-none
                                                   ${isActive ? "before:bg-[#372646]/60 before:border-white/35" : "before:bg-[#1E1628]/50 before:border-white/20"}`}
                                        style={{
                                            animationName: isActive ? "none" : "pto-pulse",
                                            animationDuration: "3s",
                                            animationTimingFunction: "ease-in-out",
                                            animationIterationCount: "infinite",
                                            transform: isActive ? "scale(1.0)" : undefined,
                                            transition: "transform 0.3s ease",
                                            aspectRatio: "1/1",
                                            fontFamily: "Fontatica4F, sans-serif",
                                            fontSize: "17px",
                                            lineHeight: "1.25",
                                        }}
                                    >
                                        <span className="relative z-10 block">{btn.label}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Mobile text panel — height = fit-content (auto, not full-height) */}
                        {mobileOpen && (
                            <div
                                className="absolute pointer-events-auto"
                                onPointerDown={(e) => e.stopPropagation()}
                                onPointerUp={(e) => e.stopPropagation()}
                                onPointerMove={(e) => e.stopPropagation()}
                                onPointerCancel={(e) => e.stopPropagation()}
                                onTouchStart={(e) => e.stopPropagation()}
                                onTouchMove={(e) => e.stopPropagation()}
                                onTouchEnd={(e) => e.stopPropagation()}
                                onTouchCancel={(e) => e.stopPropagation()}
                                onMouseDown={(e) => e.stopPropagation()}
                                onMouseMove={(e) => e.stopPropagation()}
                                onMouseUp={(e) => e.stopPropagation()}
                                onWheel={(e) => e.stopPropagation()}
                                style={{
                                    left: "14px",
                                    right: "calc(37.5% + 14px)",
                                    top: "14px",
                                    maxHeight: "calc(100svh - var(--nav-height-mobile) - 28px)",
                                    overflowY: "auto",
                                }}
                            >
                                <div
                                    className="w-full rounded-xl border border-white/15 shadow-xl pointer-events-auto"
                                    style={{
                                        background: "rgba(20,14,30,0.82)",
                                        backdropFilter: NAV_BLUR,
                                        WebkitBackdropFilter: NAV_BLUR,
                                    }}
                                    onPointerDown={(e) => e.stopPropagation()}
                                    onPointerUp={(e) => e.stopPropagation()}
                                    onPointerMove={(e) => e.stopPropagation()}
                                    onPointerCancel={(e) => e.stopPropagation()}
                                    onTouchStart={(e) => e.stopPropagation()}
                                    onTouchMove={(e) => e.stopPropagation()}
                                    onTouchEnd={(e) => e.stopPropagation()}
                                    onTouchCancel={(e) => e.stopPropagation()}
                                    onMouseDown={(e) => e.stopPropagation()}
                                    onMouseMove={(e) => e.stopPropagation()}
                                    onMouseUp={(e) => e.stopPropagation()}
                                    onWheel={(e) => e.stopPropagation()}
                                    onClick={() => setMobileOpen(null)}
                                >
                                    <div
                                        style={{
                                            padding: activeMobileBtn?.id === "price" ? "12px 14px" : "16px",
                                            color: "rgba(255,255,255,0.92)",
                                            fontFamily: "Comfortaa, sans-serif",
                                            fontSize: activeMobileBtn?.id === "price" ? "13.5px" : "15px",
                                            lineHeight: activeMobileBtn?.id === "price" ? "1.25" : "1.4",
                                        }}
                                    >
                                        {activeMobileBtn?.id === "sizes" ? (
                                            <Image
                                                src="/picstoorder/sizes.webp"
                                                alt="Шпаргалка по размерам"
                                                width={600}
                                                height={400}
                                                className="w-full h-auto rounded-lg"
                                             unoptimized />
                                        ) : (
                                            <>
                                                <p className={`whitespace-pre-line m-0 ${activeMobileBtn?.id === "price" ? 'mb-2' : 'mb-4'}`}>{activeMobileBtn?.text}</p>
                                                {activeMobileBtn?.id === "price" && (
                                                    <div className="mt-2 pt-2 border-t border-white/10">
                                                        <OrderButton isMobile={true} />
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </PicsToOrderMarquee>
                </div>
            </div>
        </PageBackground >
    );
}
