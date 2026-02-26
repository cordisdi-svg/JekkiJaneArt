import { PageBackground } from "@/components/layout/PageBackground";
import { HomeSectorsDesktop } from "@/components/sections/HomeSectorsDesktop";
import { HomeSectorsMobile } from "@/components/sections/HomeSectorsMobile";

export default function HomePage() {
  return (
    <PageBackground backgroundSrc="/mainpage/mainpage-back.png">
      <div className="h-full w-full overflow-hidden">
        <HomeSectorsDesktop />
        <HomeSectorsMobile />
      </div>
    </PageBackground>
  );
}
