import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'О художнице | JekkiJaneArt',
  description: 'Информация о художнице JekkiJane, её творческом пути и стиле.',
  alternates: {
    canonical: '/about',
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
