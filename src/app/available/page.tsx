"use client";

import { useEffect, useState } from "react";
import { PageBackground } from "@/components/layout/PageBackground";
import { SpotlightCarousel } from "@/components/carousel/SpotlightCarousel";
import { useModal } from "@/components/modals/ModalProvider";
import { ImageViewerModal } from "@/components/modals/ImageViewerModal";
import { availablePics } from "@/data/availablePics";

export default function AvailablePage() {
  const { openModal } = useModal();
  const [index, setIndex] = useState(0);
  const [viewerSrc, setViewerSrc] = useState<string | null>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem("availableCarouselIndex");
    if (saved) {
      setIndex(Number(saved));
      return;
    }
    const randomIndex = Math.floor(Math.random() * availablePics.length);
    sessionStorage.setItem("availableCarouselIndex", String(randomIndex));
    setIndex(randomIndex);
  }, []);

  return (
    <PageBackground backgroundSrc="/availablepics/back-full.png">
      <section className="mx-auto flex min-h-[calc(100vh-var(--nav-height-mobile))] w-full max-w-none flex-col gap-4 px-0 py-4 md:min-h-[calc(100vh-var(--nav-height-desktop))]">
        <h1 className="text-center text-3xl font-semibold">Готовые работы</h1>
        <div className="flex-1 px-2 md:px-0">
          <SpotlightCarousel
          items={availablePics.slice(0, 20)}
          initialIndex={index}
          centerButtons={{ leftLabel: "Забронировать", rightLabel: "О картине" }}
          onCenterActionLeft={() => openModal("order")}
          onCenterActionRight={(item) => setViewerSrc(item.src)}
          className="h-full"
        />
        </div>
      </section>
      {viewerSrc ? <ImageViewerModal src={viewerSrc} alt="О картине" onClose={() => setViewerSrc(null)} /> : null}
    </PageBackground>
  );
}
