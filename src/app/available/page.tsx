import type { Metadata } from "next";
import { PageBackground } from "@/components/layout/PageBackground";
import { PaintingsCarousel } from "@/components/carousel/PaintingsCarousel";

export const metadata: Metadata = {
  title: "В наличии | JekkiJaneArt",
  description: "Картины, находящиеся в наличии. Посмотрите работы, готовые к отправке.",
  alternates: {
    canonical: "/available",
  },
};

export default function AvailablePage() {
  return (
      <PageBackground backgroundSrc="/availablepics/back-full.webp">
      {/* Full viewport height, flex column, active zone minus nav bar. Centered content to preserve carousel size and create bottom margin. */}
      <div className="flex h-svh w-full flex-col justify-center items-center overflow-hidden pb-[var(--nav-height-mobile)] lg:pb-[var(--nav-height-desktop)]">
        <div className="relative w-full h-[86svh] max-h-[850px]">
          <PaintingsCarousel />
        </div>
      </div>
    </PageBackground>
  );
}
