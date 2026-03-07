"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";

interface FlippingWearCardProps {
    images: string[];
    startIntervalIdx?: 0 | 1; // 0 for 5s, 1 for 7s
}

// 0: 6s, 1: 10s
const INTERVALS = [6000, 10000];

const TRANSITION_DURATION = 1500;

export function FlippingWearCard({ images, startIntervalIdx = 0 }: FlippingWearCardProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(true);
    const [intervalIdx, setIntervalIdx] = useState(startIntervalIdx);
    const [isPaused, setIsPaused] = useState(false);

    const currentDelay = INTERVALS[intervalIdx];

    // Carousel auto-slide progression
    useEffect(() => {
        if (isPaused) return;

        const timer = setTimeout(() => {
            if (currentIndex === images.length - 1) {
                // At the last original image, slide to the clone
                setCurrentIndex(images.length);
                setIsTransitioning(true);
                setIntervalIdx((prev) => (prev === 0 ? 1 : 0));
            } else if (currentIndex === images.length) {
                // If it's already on the clone, wait... shouldn't stay here normally because of snap
            } else {
                // Normal slide
                setCurrentIndex((prev) => prev + 1);
                setIsTransitioning(true);
                setIntervalIdx((prev) => (prev === 0 ? 1 : 0));
            }
        }, currentDelay);

        return () => clearTimeout(timer);
    }, [currentIndex, currentDelay, isPaused, images.length]);

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
            className="relative h-full w-full rounded-2xl overflow-hidden drop-shadow-2xl select-none"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
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
