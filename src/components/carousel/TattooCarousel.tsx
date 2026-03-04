"use client";

import Image from "next/image";
import { useEffect, useRef, useCallback } from "react";

const N = 9;
const SPEED = (2 * Math.PI) / (20 * 60); // 20 sec/rev at 60fps

// ── Desktop ellipse fractions ──────────────────────────────────────────────
const CX_F = 0.50;
const CY_F = 0.54;
const AX_F = 0.42;
const AY_F = 0.28;
const MAX_SCALE = 1.0;
const MIN_SCALE = 0.28;

// ── Mobile ellipse fractions (horizontal orbit intentionally extends off-screen) ─
const M_CX_F = 0.50;
const M_CY_F = 0.52;
const M_AX_F = 0.38;
const M_AY_F = 0.18;
const M_MAX_SCALE = 1.0;
const M_MIN_SCALE = 0.20;

const IMGS = [
    '/tattoo/tattoo1.jpg', '/tattoo/tattoo2.jpg', '/tattoo/tattoo3.jpg',
    '/tattoo/tattoo4.jpg', '/tattoo/tattoo5.jpg', '/tattoo/tattoo6.jpg',
    '/tattoo/tattoo7.jpg', '/tattoo/tattoo8.jpg', '/tattoo/tattoo9.jpg',
];

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

function TextContent({ mobile = false }: { mobile?: boolean }) {
    return (
        <div className="flex flex-col gap-2 text-white text-[13px] lg:text-[15px] leading-relaxed h-full">
            <p className={`font-bold text-[13px] lg:text-[14px] text-white/95${mobile ? '' : ' whitespace-nowrap'}`}>
                Индивидуальный эскиз татуировки по вашему запросу.
            </p>
            <div className="flex flex-col gap-1">
                <p className="font-semibold text-white/90">Процесс:</p>
                <ul className="list-none flex flex-col gap-[3px] pl-1 text-white/80">
                    <li>— Обсуждение идеи и символики</li>
                    <li>— Создание эскиза</li>
                    <li>— Правки</li>
                    <li>— Финальный файл для мастера</li>
                </ul>
            </div>
            <p className="font-bold text-white/95">Стоимость: от 2 000 ₽</p>
            <p className="text-white/75 text-[11px] lg:text-[13px] italic mt-auto">
                Работаю в авторском стиле, с учётом анатомии и места нанесения.
            </p>
        </div>
    );
}

export function TattooCarousel({ mobile = false }: { mobile?: boolean }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const imgRefs = useRef<(HTMLDivElement | null)[]>(Array(N).fill(null));
    const angleRef = useRef(0);
    const pausedRef = useRef(false);
    const rafRef = useRef<number>(0);
    const halfWRef = useRef(100);
    const halfHRef = useRef(133);

    const pause = useCallback(() => { pausedRef.current = true; }, []);
    const resume = useCallback(() => { pausedRef.current = false; }, []);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // Select constants based on device type
        const cx_f = mobile ? M_CX_F : CX_F;
        const cy_f = mobile ? M_CY_F : CY_F;
        const ax_f = mobile ? M_AX_F : AX_F;
        const ay_f = mobile ? M_AY_F : AY_F;
        const max_s = mobile ? M_MAX_SCALE : MAX_SCALE;
        const min_s = mobile ? M_MIN_SCALE : MIN_SCALE;
        const img_w_f = mobile ? 0.30 : 0.22;

        // Set base image dimensions once from container width
        const initW = container.offsetWidth;
        const baseW = Math.round(initW * img_w_f);
        const baseH = Math.round(baseW * 4 / 3);
        halfWRef.current = baseW / 2;
        halfHRef.current = baseH / 2;
        imgRefs.current.forEach(el => {
            if (!el) return;
            el.style.width = `${baseW}px`;
            el.style.height = `${baseH}px`;
        });

        const step = () => {
            if (!pausedRef.current) angleRef.current += SPEED;

            const W = container.offsetWidth;
            const H = container.offsetHeight;
            const cx = cx_f * W;
            const cy = cy_f * H;
            const ax = ax_f * W;
            const ay = ay_f * H;
            const hW = halfWRef.current;
            const hH = halfHRef.current;

            imgRefs.current.forEach((el, i) => {
                if (!el) return;
                const θ = angleRef.current + (i / N) * 2 * Math.PI;
                const sinθ = Math.sin(θ);
                const cosθ = Math.cos(θ);
                const x = cx + ax * sinθ;
                const y = cy + ay * cosθ;
                const t = (1 + cosθ) / 2; // 0 = back/top, 1 = front/bottom

                const scale = lerp(min_s, max_s, t);
                const opacity = lerp(0.4, 1.0, t);
                const zIndex = Math.round(t * 100);

                el.style.transform = `translate(${x - hW}px, ${y - hH}px) scale(${scale})`;
                el.style.opacity = `${opacity}`;
                el.style.zIndex = `${zIndex}`;
            });

            rafRef.current = requestAnimationFrame(step);
        };

        rafRef.current = requestAnimationFrame(step);
        return () => cancelAnimationFrame(rafRef.current);
    }, [mobile]);

    /*
     * Ellipse math:
     *   x(θ) = cx + ax·sin(θ)    [center at cx, right at θ=π/2]
     *   y(θ) = cy + ay·cos(θ)    [spotlight bottom at θ=0, back/top at θ=π]
     *   t = (1+cos(θ))/2         [0=back, 1=front]
     *
     * Text zone z-index = 50.
     * Images at t<0.5 (top arc) → zIndex<50 → appear BEHIND text zone.
     * Images at t>0.5 (bottom arc) → zIndex>50 → appear IN FRONT.
     */

    // Textbox positioning — desktop keeps original centre-ish position, expanded ±30px
    const textboxStyle = mobile
        ? { top: '3%', left: '5%', width: '90%', zIndex: 50 }
        : { top: '5%', left: 'calc(27.5% - 25px)', width: 'calc(45% + 50px)', height: 'calc(37.4% + 50px)', zIndex: 50 };

    return (
        <div
            ref={containerRef}
            className="relative w-full h-full overflow-hidden"
            onMouseDown={pause} onMouseUp={resume} onMouseLeave={resume}
            onTouchStart={pause} onTouchEnd={resume} onTouchCancel={resume}
        >
            {/* Text zone — z-index 50 acts as visual curtain */}
            <div
                className="absolute bg-black/15 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl p-4 lg:p-5"
                style={textboxStyle}
            >
                <TextContent mobile={mobile} />
            </div>

            {/* 9 carousel images — z-index 0-100 computed in RAF */}
            {IMGS.map((src, i) => (
                <div
                    key={i}
                    ref={el => { imgRefs.current[i] = el; }}
                    className="absolute top-0 left-0 overflow-hidden rounded-xl shadow-2xl will-change-transform"
                    style={{ transformOrigin: '50% 50%' }}
                >
                    <Image
                        src={src}
                        alt={`Тату ${i + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 55vw, 20vw"
                    />
                </div>
            ))}
        </div>
    );
}
