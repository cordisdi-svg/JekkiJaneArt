// Home page
import Image from "next/image";
import { PageBackground } from "@/components/layout/PageBackground";

export default function HomePage() {
  return (
    <PageBackground backgroundSrc="/mainpage/mainpage-back.png">
      <section className="flex min-h-[70vh] flex-col items-center justify-center gap-6 text-center">
        <Image
          src="/mainpage/mainpage-icon-mobile.png"
          alt="JEKKI JANE ART"
          width={220}
          height={220}
          priority
          className="h-auto w-[220px] lg:hidden"
        />
        <Image
          src="/mainpage/mainpage-icon.png"
          alt="JEKKI JANE ART"
          width={300}
          height={300}
          priority
          className="hidden h-auto w-[300px] lg:block"
        />
        <div className="max-w-xl rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4 text-sm lg:text-base">
          Главная: SVG-сектора будут добавлены на следующем шаге.
        </div>
      </section>
    </PageBackground>
  );
}
