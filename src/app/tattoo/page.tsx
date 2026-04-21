import type { Metadata } from "next";
import Image from "next/image";
import { PageBackground } from "@/components/layout/PageBackground";
import { TattooCarousel } from "@/components/carousel/TattooCarousel";

export const metadata: Metadata = {
  title: "Татуировка | JekkiJaneArt",
  description: "Портфолио татуировок от JekkiJane. Индивидуальные эскизы и работы.",
  alternates: {
    canonical: "/tattoo",
  },
};

export default function TattooPage() {
  return (
    <PageBackground backgroundSrc="/mainpage/mainpage-back.webp">
      <div className="relative h-[100svh] w-full overflow-hidden pb-[var(--nav-height-mobile)] lg:pb-[var(--nav-height-desktop)]">

        {/* Desktop only — left image + right carousel */}
        <div className="hidden md:flex flex-row gap-4 px-4 w-full h-full">

          {/* Left image: 1.png — gap-4 from all touching edges */}
          <div className="relative aspect-[3/4] flex-shrink-0 my-4" style={{ WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)', maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)' }}>
            <Image
              src="/tattoo/1.webp"
              alt="Татуировка — портфолио"
              fill
              className="object-cover"
              sizes="30vw"
              priority
             unoptimized />
          </div>

          {/* Right zone: translateY(-8px) lifts the entire carousel object intact, creating gap-2 above nav */}
          <div className="flex-1 h-full" style={{ transform: 'translateY(-8px)' }}>
            <TattooCarousel />
          </div>

        </div>

        {/* Mobile — 1-mobile.png as background + 3D carousel */}
        <div
          className="md:hidden relative h-full w-full overflow-hidden"
          style={{
            backgroundImage: "url('/tattoo/1-mobile.webp')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <TattooCarousel mobile />
        </div>

      </div>
    </PageBackground>
  );
}
