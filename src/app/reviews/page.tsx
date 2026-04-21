import type { Metadata } from "next";
import { PageBackground } from "@/components/layout/PageBackground";

export const metadata: Metadata = {
  title: "Отзывы | JekkiJaneArt",
  description: "Отзывы клиентов о картинах и росписи от JekkiJane.",
  alternates: {
    canonical: "/reviews",
  },
};

export default function ReviewsPage() {
  return (
    <PageBackground backgroundSrc="/mainpage/mainpage-back.webp">
      <div className="min-h-screen w-full"></div>
    </PageBackground>
  );
}
