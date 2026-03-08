"use client";

import Image from "next/image";
import { useState, useCallback } from "react";

// Высота одного слайда = активная зона
const SLIDE_H = "calc(100svh - var(--nav-height-mobile))";

const slides = [
    { src: "/wear-and-shoes/1.png", alt: "Роспись одежды" },
    { src: "/wear-and-shoes/2.JPEG", alt: "Роспись обуви" },
    { src: "/wear-and-shoes/3.jpeg", alt: "Роспись одежды 3" },
    { src: "/wear-and-shoes/4.png", alt: "Роспись одежды 4" },
    { src: "/wear-and-shoes/5.png", alt: "Роспись одежды 5" },
];

export function WearMarquee() {
    const [paused, setPaused] = useState(false);

    const handleTouchStart = useCallback(() => setPaused(true), []);
    const handleTouchEnd = useCallback(() => setPaused(false), []);

    return (
        /*
         * 2 слайда × 2 копии = 4 элемента.
         * Gap = 0 (встык). translateY(-50%) = 2 × SLIDE_H = один полный цикл ✓
         */
        <div
            className="relative w-full overflow-hidden"
            style={{ height: SLIDE_H }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
        >
            <style jsx>{`
                @keyframes wear-marquee-y {
                    0%   { transform: translateY(0); }
                    100% { transform: translateY(-50%); }
                }
                .wear-track {
                    animation: wear-marquee-y 41s linear infinite;
                }
            `}</style>

            <div
                className="wear-track flex flex-col"
                style={{ animationPlayState: paused ? "paused" : "running" }}
            >
                {[...slides, ...slides].map((slide, i) => (
                    <div
                        key={i}
                        className="relative flex-shrink-0 w-full"
                        style={{ height: SLIDE_H }}
                    >
                        <Image
                            src={slide.src}
                            alt={slide.alt}
                            fill
                            className="object-cover"
                            sizes="100vw"
                            priority={i < 2}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
