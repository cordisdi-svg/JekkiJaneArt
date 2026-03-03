import { PageBackground } from "@/components/layout/PageBackground";
import { PaintingsCarousel } from "@/components/carousel/PaintingsCarousel";

export default function AvailablePage() {
  return (
    <PageBackground backgroundSrc="/availablepics/back-full.png">
      {/* Full viewport height, flex column, active zone minus nav bar. Centered content to preserve carousel size and create bottom margin. */}
      <div className="flex h-svh w-full flex-col justify-center items-center overflow-hidden pb-[var(--nav-height-mobile)] lg:pb-[var(--nav-height-desktop)]">
        <div className="relative w-full h-[86vh] max-h-[850px]">
          <PaintingsCarousel />
        </div>
      </div>
    </PageBackground>
  );
}
