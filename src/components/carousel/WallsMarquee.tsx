"use client";

import Image from "next/image";

const wallsImages = [
    { src: '/walls/1.png', alt: 'Роспись 1' },
    { src: '/walls/2.png', alt: 'Роспись 2' },
    { src: '/walls/3.png', alt: 'Роспись 3' },
    { src: '/walls/4.png', alt: 'Роспись 4' },
    { src: '/walls/5.jpg', alt: 'Роспись 5' },
];

export function WallsMarquee() {
    return (
        <div className="relative w-full h-full overflow-hidden md:py-2">
            <style jsx>{`
                @keyframes marquee-x {
                    0%   { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                @keyframes marquee-y {
                    0%   { transform: translateY(0); }
                    100% { transform: translateY(-50%); }
                }
                .run-marquee {
                    display: flex;
                    flex-direction: column;
                    animation: marquee-y 41s linear infinite;
                }
                .run-marquee:hover,
                .run-marquee:active {
                    animation-play-state: paused;
                }
                @media (min-width: 768px) {
                    .run-marquee {
                        flex-direction: row;
                        width: max-content;
                        height: 100%;
                        animation: marquee-x 41s linear infinite;
                    }
                }
            `}</style>

            {/*
                Бесшовная петля:
                - Внутри сета: gap-G
                - На торцах сета (по направлению скролла): padding = G/2
                - Стык = G/2 + G/2 = G → равен промежутку между картинами
                - translateX/Y(-50%) = ровно одна ширина/высота первого сета ✓

                Десктоп: gap-4 (16px), px-2 (8px = 16/2)
                Мобила:  gap-3 (12px), pb-3 (12px трейлинг для петли)
            */}
            <div className="run-marquee">

                {/* Первый сет */}
                <div className="flex flex-col md:flex-row shrink-0 gap-3 md:gap-4 pb-3 md:pb-0 md:px-2">
                    {wallsImages.map((img, i) => (
                        <div
                            key={`set1-${i}`}
                            className="relative mx-auto md:mx-0 w-[calc(100vw-24px)] md:w-auto md:h-full aspect-[4/5] flex-shrink-0 cursor-pointer rounded-2xl overflow-hidden shadow-xl border border-white/10"
                        >
                            <Image
                                src={img.src}
                                alt={img.alt}
                                fill
                                sizes="(max-width: 768px) calc(100vw - 24px), 40vw"
                                className="object-cover"
                                priority
                            />
                        </div>
                    ))}
                </div>

                {/* Дублированный сет (для петли) */}
                <div aria-hidden className="flex flex-col md:flex-row shrink-0 gap-3 md:gap-4 pb-3 md:pb-0 md:px-2">
                    {wallsImages.map((img, i) => (
                        <div
                            key={`set2-${i}`}
                            className="relative mx-auto md:mx-0 w-[calc(100vw-24px)] md:w-auto md:h-full aspect-[4/5] flex-shrink-0 cursor-pointer rounded-2xl overflow-hidden shadow-xl border border-white/10"
                        >
                            <Image
                                src={img.src}
                                alt={img.alt}
                                fill
                                sizes="(max-width: 768px) calc(100vw - 24px), 40vw"
                                className="object-cover"
                                priority
                            />
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}
