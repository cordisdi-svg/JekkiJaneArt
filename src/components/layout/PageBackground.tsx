import Image from "next/image";

type PageBackgroundProps = {
  backgroundSrc?: string;
  children: React.ReactNode;
};

export function PageBackground({ backgroundSrc, children }: PageBackgroundProps) {
  return (
    <div className="relative min-h-screen">
      {backgroundSrc ? (
        <Image
          src={backgroundSrc}
          alt="Фоновое изображение"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      ) : null}
      {backgroundSrc ? <div className="absolute inset-0 bg-white/45" aria-hidden="true" /> : null}
      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-8 lg:px-8 lg:py-12">{children}</div>
    </div>
  );
}
