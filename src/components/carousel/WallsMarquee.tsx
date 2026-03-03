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
        <div className="relative flex w-full h-[80vh] overflow-hidden items-center my-auto">
            <div className="flex w-max animate-marquee hover:[animation-play-state:paused] active:[animation-play-state:paused]">
                {/* First Set */}
                <div className="flex shrink-0 gap-6 md:gap-12 px-3 md:px-6 h-full">
                    {wallsImages.map((img, i) => (
                        <div key={`set1-${i}`} className="relative h-full aspect-[3/4] md:aspect-[4/5] flex-shrink-0 cursor-pointer rounded-2xl overflow-hidden shadow-xl border border-white/10">
                            <Image
                                src={img.src}
                                alt={img.alt}
                                fill
                                sizes="(max-width: 768px) 80vw, 40vw"
                                className="object-cover"
                                priority
                            />
                        </div>
                    ))}
                </div>
                {/* Duplicated Set for infinite loop */}
                <div aria-hidden className="flex shrink-0 gap-6 md:gap-12 px-3 md:px-6 h-full">
                    {wallsImages.map((img, i) => (
                        <div key={`set2-${i}`} className="relative h-full aspect-[3/4] md:aspect-[4/5] flex-shrink-0 cursor-pointer rounded-2xl overflow-hidden shadow-xl border border-white/10">
                            <Image
                                src={img.src}
                                alt={img.alt}
                                fill
                                sizes="(max-width: 768px) 80vw, 40vw"
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
