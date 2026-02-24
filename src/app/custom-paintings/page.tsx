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
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-4 py-8 lg:py-12">
        <h1 className="text-center text-3xl font-semibold">Картины на заказ</h1>
        <div className="grid gap-4 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <CustomPaintingsAccordion />
          </div>
          <div className="lg:col-span-3">
            <SpotlightCarousel
              items={picToOrderPics}
              centerButtons={{ leftLabel: "Увеличить", rightLabel: "Свернуть" }}
              onCenterActionLeft={(item) => setEnlarged(item.src)}
              onCenterActionRight={() => setEnlarged(null)}
            />
          </div>
        </div>
      </section>
      {enlarged ? <ImageViewerModal src={enlarged} alt="Картина на заказ" onClose={() => setEnlarged(null)} /> : null}
    </PageBackground>
  );
}
