"use client";

import { useState } from "react";
import { PageBackground } from "@/components/layout/PageBackground";
import { SpotlightCarousel } from "@/components/carousel/SpotlightCarousel";
import { CustomPaintingsAccordion } from "@/components/sections/CustomPaintingsAccordion";
import { picToOrderPics } from "@/data/picToOrderPics";
import { ImageViewerModal } from "@/components/modals/ImageViewerModal";

export default function CustomPaintingsPage() {
  const [enlarged, setEnlarged] = useState<string | null>(null);

  return (
    <PageBackground backgroundSrc="/mainpage/mainpage-back.png">
      <section className="mx-auto flex min-h-[calc(100vh-var(--nav-height-mobile))] w-full max-w-none flex-col gap-3 px-2 py-3 md:min-h-[calc(100vh-var(--nav-height-desktop))] lg:px-3">
        <h1 className="mx-auto rounded-lg bg-white/70 px-4 py-1 text-center text-3xl font-semibold">Картины на заказ</h1>
        <div className="grid flex-1 gap-2 lg:grid-cols-5">
          <div className="order-2 lg:order-1 lg:col-span-2">
            <CustomPaintingsAccordion />
          </div>
          <div className="order-1 lg:order-2 lg:col-span-3">
            <SpotlightCarousel items={picToOrderPics} onCenterImageClick={(item) => setEnlarged((prev) => (prev ? null : item.src))} className="h-full" centerImageFit="object-cover" />
          </div>
        </div>
      </section>
      {enlarged ? <ImageViewerModal src={enlarged} alt="Картина на заказ" onClose={() => setEnlarged(null)} /> : null}
    </PageBackground>
  );
}
