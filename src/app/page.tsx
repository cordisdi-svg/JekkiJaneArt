import { PageBackground } from "@/components/layout/PageBackground";
import { HomeSectorsDesktop } from "@/components/sections/HomeSectorsDesktop";
import { HomeSectorsMobile } from "@/components/sections/HomeSectorsMobile";

export default function HomePage() {
  return (
    <div className="h-[calc(100svh-var(--nav-height))] w-full overflow-hidden">
      <PageBackground backgroundSrc="/mainpage/mainpage-back.png">
        <HomeSectorsDesktop />
        <HomeSectorsMobile />
      </PageBackground>
    </div>
  );
}
