"use client";

import Image from "next/image";

const picsToOrderImages = [
    { src: "/picstoorder/pic1.JPG", alt: "Картина 1" },
    { src: "/picstoorder/pic2.JPG", alt: "Картина 2" },
    { src: "/picstoorder/pic3.JPG", alt: "Картина 3" },
    { src: "/picstoorder/pic4.JPG", alt: "Картина 4" },
    { src: "/picstoorder/pic5.JPG", alt: "Картина 5" },
    { src: "/picstoorder/pic6.PNG", alt: "Картина 6" },
    { src: "/picstoorder/pic7.JPG", alt: "Картина 7" },
    { src: "/picstoorder/pic8.JPG", alt: "Картина 8" },
    { src: "/picstoorder/pic9.JPG", alt: "Картина 9" },
    { src: "/picstoorder/pic10.JPG", alt: "Картина 10" },
    { src: "/picstoorder/pic11.PNG", alt: "Картина 11" },
];

export function PicsToOrderMarquee() {
    return (
        <div className="relative w-full h-full overflow-hidden md:py-2">
            <style jsx>{`
        @keyframes marquee-x-pto {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-y-pto {
          0%   { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        .run-marquee-pto {
          display: flex;
          flex-direction: column;
          animation: marquee-y-pto 60s linear infinite;
        }
        @media (min-width: 768px) {
          .run-marquee-pto {
            flex-direction: row;
            width: max-content;
            height: 100%;
            animation: marquee-x-pto 60s linear infinite;
          }
        }
      `}</style>

            {/*
        Seamless loop:
        - gap-4 (16px) inside set, px-2 (8px = 16/2) on ends (desktop)
        - gap-3 (12px) inside set, pb-3 trailing (mobile)
        - translateX/Y(-50%) = exactly one set width/height
      */}
            <div className="run-marquee-pto">
                {/* First set */}
                <div className="flex flex-col md:flex-row shrink-0 gap-3 md:gap-4 pb-3 md:pb-0 md:px-2">
                    {picsToOrderImages.map((img, i) => (
                        <div
                            key={`set1-${i}`}
                            className="relative mx-auto md:mx-0 w-[calc(100vw-24px)] md:w-auto md:h-full aspect-[4/5] flex-shrink-0 rounded-2xl overflow-hidden shadow-xl border border-white/10"
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

                {/* Duplicated set (for seamless loop) */}
                <div aria-hidden className="flex flex-col md:flex-row shrink-0 gap-3 md:gap-4 pb-3 md:pb-0 md:px-2">
                    {picsToOrderImages.map((img, i) => (
                        <div
                            key={`set2-${i}`}
                            className="relative mx-auto md:mx-0 w-[calc(100vw-24px)] md:w-auto md:h-full aspect-[4/5] flex-shrink-0 rounded-2xl overflow-hidden shadow-xl border border-white/10"
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
