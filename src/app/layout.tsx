import type { Metadata } from "next";
import "./globals.css";
import { BottomNavigation } from "@/components/nav/BottomNavigation";
import { ModalProvider } from "@/components/modals/ModalProvider";
import { InteractionGuards } from "@/components/system/InteractionGuards";
import { DeviceLayoutSync } from "@/components/system/DeviceLayoutSync";

export const metadata: Metadata = {
  title: "Портфолио художницы",
  description: "Описание сайта будет добавлено позже"
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
