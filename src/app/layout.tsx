import type { Metadata } from "next";
import "./globals.css";
import { BottomNavigation } from "@/components/nav/BottomNavigation";
import { ModalProvider } from "@/components/modals/ModalProvider";

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
        <link rel="preload" href="/fonts/IndiKazka4F.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/Abibas.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
        <style dangerouslySetInnerHTML={{
          __html: `
          @font-face {
            font-family: 'IndiKazka';
            src: url('/fonts/IndiKazka4F.ttf') format('truetype');
            font-weight: normal;
            font-style: normal;
            font-display: swap;
          }
          @font-face {
            font-family: 'Abibas';
            src: url('/fonts/Abibas.ttf') format('truetype');
            font-weight: normal;
            font-style: normal;
            font-display: swap;
          }
        ` }} />
      </head>
      <body>
        <ModalProvider>
          <div className="min-h-screen">
            <main className="w-full">
              {children}
            </main>
            <BottomNavigation />
          </div>
        </ModalProvider>
      </body>
    </html>
  );
}
