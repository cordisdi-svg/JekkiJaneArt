"use client";

import { useIsTouchDevice } from "@/lib/deviceDetect";
import { PageBackground } from "@/components/layout/PageBackground";
import { HomeSectorsDesktop } from "@/components/sections/HomeSectorsDesktop";
import { HomeSectorsMobile } from "@/components/sections/HomeSectorsMobile";

export default function HomePage() {
  const isTouch = useIsTouchDevice();

  return (
    <PageBackground backgroundSrc="/mainpage/mainpage-back.png">
      <div className="h-[100svh] w-full overflow-hidden pb-[var(--nav-height-mobile)]">
        {isTouch ? <HomeSectorsMobile /> : <HomeSectorsDesktop />}
      </div>
    </PageBackground>
  );
}
