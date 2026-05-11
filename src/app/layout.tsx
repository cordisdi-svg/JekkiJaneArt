import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import "./globals.css";
import { BottomNavigation } from "@/components/nav/BottomNavigation";
import { ModalProvider } from "@/components/modals/ModalProvider";
import { InteractionGuards } from "@/components/system/InteractionGuards";
import { DeviceLayoutSync } from "@/components/system/DeviceLayoutSync";
import dynamic from "next/dynamic";
const InstagramTooltip = dynamic(() => import("@/components/ui/InstagramTooltip").then(mod => ({ default: mod.InstagramTooltip })), { ssr: false });

const playfair = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-playfair",
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://jekkiart.ru"),
  title: "JekkiJaneArt — искусство в уникальном стиле, делающее вашу жизнь, дом и образ ярче и эстетичнее",
  description: "Арт-галерея JekkiJaneArt где вы можете заказать воплощение любой своей художественной идеи на холсте, стене, одежде; выбрать из уже написанных картин или создать картину-проводник для своей энергии",
  icons: {
    icon: "/icon.jpeg",
    apple: "/icon.jpeg",
  },
  openGraph: {
    type: "website",
    siteName: "JekkiJaneArt",
    locale: "ru_RU",
    title: "JekkiJaneArt — искусство в уникальном стиле, делающее вашу жизнь, дом и образ ярче и эстетичнее",
    description: "Арт-галерея JekkiJaneArt где вы можете заказать воплощение любой своей художественной идеи на холсте, стене, одежде; выбрать из уже написанных картин или создать картину-проводник для своей энергии",
    url: "https://jekkiart.ru",
    images: [{
      url: "/og-image.jpg",
      width: 1200,
      height: 630,
      alt: "JekkiJaneArt — искусство в уникальном стиле",
    }]
  },
  twitter: {
    card: "summary_large_image",
    title: "JekkiJaneArt — искусство в уникальном стиле, делающее вашу жизнь, дом и образ ярче и эстетичнее",
    description: "Арт-галерея JekkiJaneArt где вы можете заказать воплощение любой своей художественной идеи на холсте, стене, одежде; выбрать из уже написанных картин или создать картину-проводник для своей энергии",
    images: ["/og-image.jpg"]
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={playfair.variable}>
      <head>
        <link rel="preload" href="/fonts/subset-Fontatica4F.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var isTouch = window.matchMedia('(pointer: coarse)').matches || (navigator.maxTouchPoints || 0) > 0;
                if (isTouch) { document.documentElement.classList.add('is-touch'); }
                else { document.documentElement.classList.add('is-desktop'); }
              })();
            `
          }}
        />
      </head>
      <body>
        <ModalProvider>
          <InteractionGuards />
          <DeviceLayoutSync />
          <InstagramTooltip />
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
