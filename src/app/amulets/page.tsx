import { PageBackground } from "@/components/layout/PageBackground";
import { AmuletsCarousel } from "@/components/amulets/AmuletsCarousel";

export default function AmuletsPage() {
  return (
    <PageBackground backgroundSrc="/mainpage/mainpage-back.png">
      {/* Container calculates exact space between top and nav minus a 0.5rem (gap-2) buffer on both sides */}
      <div className="flex h-svh w-full flex-col justify-start items-center overflow-hidden pb-[var(--nav-height-mobile)] lg:pb-[var(--nav-height-desktop)]">
        <div className="relative w-full h-full lg:h-[calc(100vh-var(--nav-height-desktop)-1rem)] max-h-[850px] lg:px-2 lg:py-2">
          <AmuletsCarousel />
        </div>
      </div>
    </PageBackground>
  );
}
