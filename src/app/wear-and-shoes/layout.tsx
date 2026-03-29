import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Одежда и Обувь | JekkiJaneArt',
  description: 'Уникальная роспись одежды и обуви от JekkiJane. Индивидуальный дизайн.',
};

export default function WearAndShoesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
