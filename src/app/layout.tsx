import type { Metadata } from "next";
import "./globals.css";
import { BottomNavigation } from "@/components/nav/BottomNavigation";
import { ModalProvider } from "@/components/modals/ModalProvider";
import { InteractionGuards } from "@/components/system/InteractionGuards";
import { DeviceLayoutSync } from "@/components/system/DeviceLayoutSync";
import { InstagramTooltip } from "@/components/ui/InstagramTooltip";

export const metadata: Metadata = {
  title: "JekkiJaneArt — искусство в уникальном стиле, делающее вашу жизнь, дом и образ ярче и эстетичнее",
  description: "Арт-галерея JekkiJaneArt где вы можете заказать воплощение любой своей художественной идеи на холсте, стене, одежде; выбрать из уже написанных картин или создать картину-проводник для своей энергии",
  openGraph: {
    type: "website",
    title: "JekkiJaneArt — искусство в уникальном стиле, делающее вашу жизнь, дом и образ ярче и эстетичнее",
    description: "Арт-галерея JekkiJaneArt где вы можете заказать воплощение любой своей художественной идеи на холсте, стене, одежде; выбрать из уже написанных картин или создать картину-проводник для своей энергии",
    url: "https://jekkiart.ru",
    images: [{
      url: "https://raw.githubusercontent.com/cordisdi-svg/JekkiJaneArt/f2ac6d0bc33c6d548209d35c6f245277c1b46f32/public/og-image.jpg"
    }]
  },
  twitter: {
    card: "summary_large_image",
    title: "JekkiJaneArt — искусство в уникальном стиле, делающее вашу жизнь, дом и образ ярче и эстетичнее",
    description: "Арт-галерея JekkiJaneArt где вы можете заказать воплощение любой своей художественной идеи на холсте, стене, одежде; выбрать из уже написанных картин или создать картину-проводник для своей энергии",
    images: ["https://raw.githubusercontent.com/cordisdi-svg/JekkiJaneArt/f2ac6d0bc33c6d548209d35c6f245277c1b46f32/public/og-image.jpg"]
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap"
          rel="stylesheet"
        />
        <link rel="preload" href="/fonts/Abibas.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />

      </head>
      <body>
        <InteractionGuards />
        <DeviceLayoutSync />
        <InstagramTooltip />
        <ModalProvider>
          <div className="w-full h-full relative">
            <main className="w-full h-full">
              {children}
            </main>
            <BottomNavigation />
          </div>
        </ModalProvider>
      </body>
    </html>
  );
}
