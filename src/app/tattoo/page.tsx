import Image from "next/image";
import { PageBackground } from "@/components/layout/PageBackground";
import { TattooCarousel } from "@/components/carousel/TattooCarousel";

export default function TattooPage() {
  return (
    <PageBackground backgroundSrc="/mainpage/mainpage-back.png">
      <div className="relative h-[100svh] w-full overflow-hidden pb-[var(--nav-height-mobile)] lg:pb-[var(--nav-height-desktop)]">

        {/* Desktop only — left image + right carousel */}
        <div className="hidden md:flex flex-row gap-4 px-4 pb-2 w-full h-full overflow-hidden">

          {/* Left image: 1.png — gap-4 from all touching edges */}
          <div className="relative aspect-[3/4] flex-shrink-0 overflow-hidden rounded-2xl shadow-xl my-4">
            <Image
              src="/tattoo/1.png"
              alt="Татуировка — портфолио"
              fill
              className="object-cover"
              sizes="30vw"
              priority
            />
          </div>

          {/* Right zone: 3D carousel fills all remaining space */}
          <div className="flex-1 h-full">
            <TattooCarousel />
          </div>

        </div>

        {/* Mobile stub — TODO */}
        <div className="md:hidden flex items-center justify-center h-full text-white text-sm opacity-50">
          Раздел в разработке
        </div>

      </div>
    </PageBackground>
  );
}
