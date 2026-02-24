import Image from "next/image";
import { PageBackground } from "@/components/layout/PageBackground";

export default function HomePage() {
  return (
    <PageBackground backgroundSrc="/mainpage/mainpage-back.png">
      <section className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
        <Image src="/mainpage/mainpage-icon.png" alt="JEKKI JANE ART" width={320} height={320} className="hidden h-auto w-[280px] lg:block" />
        <Image src="/mainpage/mainpage-icon-mobile.png" alt="JEKKI JANE ART" width={220} height={220} className="h-auto w-[220px] lg:hidden" />
        <p className="rounded-lg bg-[var(--card-bg)] px-4 py-2 text-sm">Секторы главной страницы будут добавлены на следующем шаге.</p>
      </section>
    </PageBackground>
  );
}
