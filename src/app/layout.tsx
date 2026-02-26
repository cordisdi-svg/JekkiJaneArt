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
          <div className="h-svh overflow-hidden">
            <main className="mainContent relative h-[calc(100svh-var(--nav-h))] overflow-hidden">
              {children}
            </main>
            <BottomNavigation />
          </div>
        </ModalProvider>
      </body>
    </html>
  );
}
