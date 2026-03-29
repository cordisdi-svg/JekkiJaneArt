import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Картины на заказ | JekkiJaneArt',
  description: 'Заказать интерьерную картину, портрет или копию работы от JekkiJane.',
};

export default function PicsToOrderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
