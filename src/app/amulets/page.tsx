import { PageBackground } from "@/components/layout/PageBackground";
import { AmuletsCarousel } from "@/components/amulets/AmuletsCarousel";

export default function AmuletsPage() {
  return (
    <PageBackground backgroundSrc="/mainpage/mainpage-back.png">
      {/* Container calculates exact space between top and nav minus a 0.5rem (gap-2) buffer on both sides */}
      <div className="flex h-svh w-full flex-col justify-center items-center overflow-hidden pb-[var(--nav-height-desktop)]">
        <div className="relative w-full h-[calc(100vh-var(--nav-height-desktop)-1rem)] max-h-[850px]">
          <AmuletsCarousel />
        </div>
      </div>
    </PageBackground>
  );
}
