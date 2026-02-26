import { PageBackground } from "@/components/layout/PageBackground";
import { HomeSectorsDesktop } from "@/components/home/HomeSectorsDesktop";
import { HomeSectorsMobile } from "@/components/home/HomeSectorsMobile";

export default function HomePage() {
  return (
    <PageBackground backgroundSrc="/mainpage/mainpage-back.png">
      <div className="home-page-shell overflow-hidden lg:-mb-[var(--nav-height-desktop)] -mb-[calc(var(--nav-height-mobile)+env(safe-area-inset-bottom))]">
        <HomeSectorsDesktop />
        <HomeSectorsMobile />
      </div>
    </PageBackground>
  );
}
