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
      <body>
        <ModalProvider>
          <div className="min-h-screen">
            <main className="pb-[calc(var(--nav-height-mobile)+env(safe-area-inset-bottom))] lg:pb-[var(--nav-height-desktop)]">
              {children}
            </main>
            <BottomNavigation />
          </div>
        </ModalProvider>
      </body>
    </html>
  );
}
