import dynamic from "next/dynamic";
import { PageBackground } from "@/components/layout/PageBackground";

const HomeSectorsMobile = dynamic(() => import("@/components/sections/HomeSectorsMobile").then(mod => ({ default: mod.HomeSectorsMobile })), { ssr: false });
const HomeSectorsDesktop = dynamic(() => import("@/components/sections/HomeSectorsDesktop").then(mod => ({ default: mod.HomeSectorsDesktop })), { ssr: false });

export default function HomePage() {
  return (
    <PageBackground backgroundSrc="/mainpage/mainpage-back.webp">
      <div className="hide-on-desktop">
        <HomeSectorsMobile />
      </div>
      <div className="hide-on-mobile h-[100svh] w-full overflow-hidden pb-[var(--nav-height-mobile)]">
        <HomeSectorsDesktop />
      </div>
    </PageBackground>
  );
}
