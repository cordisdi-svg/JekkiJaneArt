"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useCallback, useState } from "react";

const N = 9;
const SPEED = (2 * Math.PI) / (20 * 60); // 20 sec/rev at 60fps

// ── Desktop ellipse fractions ──────────────────────────────────────────────
const CX_F = 0.50;
const CY_F = 0.47;
const AX_F = 0.42;
const AY_F = 0.28;
const MAX_SCALE = 1.0;
const MIN_SCALE = 0.28;

// ── Mobile ellipse fractions ───────────────────────────────────────────────
const M_CX_F = 0.50;
const M_CY_F = 0.63;
const M_AX_F = 0.45;
const M_AY_F = 0.20;
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
        <div className={`flex flex-col text-white ${mobile
            ? 'gap-[5px] text-[12px] leading-tight'
            : 'gap-[6px] text-[13px] lg:text-[15px] leading-snug'
            }`}>
            <p className={`font-bold text-white/95 ${mobile ? 'text-[13px]' : 'text-[13px] lg:text-[14px] whitespace-nowrap'
                }`}>
                Индивидуальный эскиз татуировки по вашему запросу.
            </p>
            <div className={`flex flex-col ${mobile ? 'gap-[1px]' : 'gap-[2px]'}`}>
                <p className="font-semibold text-white/90">Процесс:</p>
                <ul className={`list-none flex flex-col pl-1 text-white/80 ${mobile ? 'gap-0' : 'gap-[2px]'}`}>
                    <li>— Обсуждение идеи и символики</li>
                    <li>— Создание эскиза</li>
                    <li>— Правки</li>
                    <li>— Финальный файл для мастера</li>
                </ul>
            </div>
            <div className="flex flex-col gap-[6px]">
                <p className="font-bold text-white/95">Стоимость: от 2 000 ₽</p>
                <p className={`text-white/75 italic ${mobile ? 'text-[11px]' : 'text-[11px] lg:text-[13px]'}`}>
                    Работаю в авторском стиле, с учётом анатомии и места нанесения.
                </p>
            </div>
        </div>
    );
}

export function TattooCarousel({ mobile = false }: { mobile?: boolean }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const textboxRef = useRef<HTMLDivElement>(null);
    const imgRefs = useRef<(HTMLDivElement | null)[]>(Array(N).fill(null));
    const angleRef = useRef(0);
    const pausedRef = useRef(false);
    const rafRef = useRef<number>(0);
    const halfWRef = useRef(100);
    const halfHRef = useRef(133);

    // Live textbox bounds (in px, relative to carousel container) for mask
    const [maskBounds, setMaskBounds] = useState({ l: 0, t: 0, w: 0, h: 0 });

    const pause = useCallback(() => { pausedRef.current = true; }, []);
    const resume = useCallback(() => { pausedRef.current = false; }, []);

    // ── Compute mask bounds whenever sizes change ───────────────────────────
    useLayoutEffect(() => {
        const tb = textboxRef.current;
        const con = containerRef.current;
        if (!tb || !con) return;

        const update = () => {
            const tbR = tb.getBoundingClientRect();
            const conR = con.getBoundingClientRect();
            setMaskBounds({
                l: tbR.left - conR.left,
                t: tbR.top - conR.top,
                w: tbR.width,
                h: tbR.height,
            });
        };

        update();
        const ro = new ResizeObserver(update);
        ro.observe(tb);
        ro.observe(con);
        return () => ro.disconnect();
    }, [mobile]);

    // ── Animation loop ─────────────────────────────────────────────────────
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const cx_f = mobile ? M_CX_F : CX_F;
        const cy_f = mobile ? M_CY_F : CY_F;
        const ax_f = mobile ? M_AX_F : AX_F;
        const ay_f = mobile ? M_AY_F : AY_F;
        const max_s = mobile ? M_MAX_SCALE : MAX_SCALE;
        const min_s = mobile ? M_MIN_SCALE : MIN_SCALE;
        const img_w_f = mobile ? 0.30 : 0.22;

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
                const t = (1 + cosθ) / 2;

                const scale = lerp(min_s, max_s, t);
                const opacity = lerp(0.4, 1.0, t);
                const zIndex = Math.round(t * 100);

                el.style.transform = `translate(${x - hW}px, ${y - hH}px) scale(${scale})`;
                el.style.opacity = `${opacity}`;
                el.style.zIndex = `${zIndex}`;
            });

            rafRef.current = requestAnimationFrame(step);
        };

        // Delay one rAF so the container has settled layout before measuring
        rafRef.current = requestAnimationFrame(() => {
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
            rafRef.current = requestAnimationFrame(step);
        });

        return () => cancelAnimationFrame(rafRef.current);
    }, [mobile]);

    /*
     * Ellipse math:
     *   x(θ) = cx + ax·sin(θ)    [center at cx, right at θ=π/2]
     *   y(θ) = cy + ay·cos(θ)    [spotlight bottom at θ=0, back/top at θ=π]
     *   t = (1+cos(θ))/2         [0=back, 1=front]
     *
     * Text zone z-index = 50.
     * All image divs live inside a mask-wrapper which creates its own stacking
     * context (mask property) — so image z-indices never compete with the textbox.
     * The mask punches a hole in the wrapper at the textbox bounds so even the
     * background shines through cleanly.
     */

    // Textbox positioning
    // Mobile: width 58.5% (78%×0.75), centred, bottom at 43.5% from nav
    const textboxStyle: React.CSSProperties = mobile
        ? { bottom: '43.5%', left: '50%', transform: 'translateX(-50%)', width: '58.5%', zIndex: 50 }
        : { top: '5%', left: 'calc(27.5% + 5px)', width: 'calc(45% - 10px)', zIndex: 50 };

    // CSS mask: opaque everywhere EXCEPT the textbox rectangle (transparent there)
    const { l, t: mt, w: mw, h: mh } = maskBounds;
    const maskWrapperStyle: React.CSSProperties = mw > 0 ? {
        position: 'absolute',
        inset: 0,
        // Webkit (Safari / older Chrome)
        WebkitMaskImage: 'linear-gradient(#fff,#fff), linear-gradient(#fff,#fff)',
        WebkitMaskSize: `100% 100%, ${mw}px ${mh}px`,
        WebkitMaskPosition: `0 0, ${l}px ${mt}px`,
        WebkitMaskRepeat: 'no-repeat, no-repeat',
        WebkitMaskComposite: 'destination-out',
        // Standard
        maskImage: 'linear-gradient(#fff,#fff), linear-gradient(#fff,#fff)',
        maskSize: `100% 100%, ${mw}px ${mh}px`,
        maskPosition: `0 0, ${l}px ${mt}px`,
        maskRepeat: 'no-repeat, no-repeat',
        maskComposite: 'exclude',
    } : { position: 'absolute', inset: 0 };

    return (
        <div
            ref={containerRef}
            className="relative w-full h-full overflow-hidden"
            onMouseDown={pause} onMouseUp={resume} onMouseLeave={resume}
            onTouchStart={pause} onTouchEnd={resume} onTouchCancel={resume}
        >
            {/* Text zone — always above the mask-wrapper stacking context */}
            <div
                ref={textboxRef}
                className="absolute bg-black/15 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl p-4 lg:p-5"
                style={textboxStyle}
            >
                <TextContent mobile={mobile} />
            </div>

            {/* Image wrapper — mask punches hole at textbox bounds */}
            <div style={maskWrapperStyle}>
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
        </div>
    );
}
