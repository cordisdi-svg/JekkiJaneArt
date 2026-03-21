"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface FlippingWearCardProps {
    images: string[];
    initialDelay?: number;
    interval?: number;
}

const TRANSITION_DURATION = 1500;

export function FlippingWearCard({ images, initialDelay = 0, interval = 3000 }: FlippingWearCardProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(true);

    const handleAdvance = () => {
        setCurrentIndex(prev => prev + 1);
        setIsTransitioning(true);
    };

    // Auto-advance logic
    useEffect(() => {
        let intervalId: NodeJS.Timeout;
        const startTimeout = setTimeout(() => {
            // First jump happens after initialDelay
            handleAdvance();
            // Then every 'interval'
            intervalId = setInterval(handleAdvance, interval);
        }, initialDelay);

        return () => {
            clearTimeout(startTimeout);
            if (intervalId) clearInterval(intervalId);
        };
    }, [initialDelay, interval]);

    // Handle seamless snap when we reach the cloned first image
    useEffect(() => {
        if (currentIndex === images.length) {
            const snapTimer = setTimeout(() => {
                setIsTransitioning(false);
                setCurrentIndex(0);
            }, TRANSITION_DURATION);
            return () => clearTimeout(snapTimer);
        }
    }, [currentIndex, images.length]);

    // Append the first image at the end for the seamless sliding loop
    const renderedImages = [...images, images[0]];

    return (
        <div
            className="relative h-full w-full rounded-2xl overflow-hidden drop-shadow-2xl select-none cursor-pointer"
            onClick={handleAdvance}
        >
            <div
                className="h-full w-full flex flex-col"
                style={{
                    transform: `translateY(-${currentIndex * 100}%)`,
                    transition: isTransitioning ? `transform ${TRANSITION_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)` : "none"
                }}
            >
                {renderedImages.map((src, i) => (
                    <div key={i} className="relative h-full w-full flex-shrink-0">
                        <Image
                            src={src}
                            alt={`Wear and Shoes Image ${i}`}
                            fill
                            sizes="25vw"
                            className="object-cover"
                            priority={i < 2}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
