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
      <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-3 px-2 py-4 md:px-4">
        <h1 className="text-center text-3xl font-semibold">Готовые работы</h1>
        <SpotlightCarousel
          items={availablePics.slice(0, 20)}
          initialIndex={index}
          centerButtons={{ leftLabel: "Забронировать", rightLabel: "О картине" }}
          onCenterActionLeft={() => openModal("order")}
          onCenterActionRight={(item) => setViewerSrc(item.src)}
        />
      </section>
      {viewerSrc ? <ImageViewerModal src={viewerSrc} alt="О картине" onClose={() => setViewerSrc(null)} /> : null}
    </PageBackground>
  );
}
