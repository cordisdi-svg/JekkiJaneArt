import Image from "next/image";

export function PageBackground({
  backgroundSrc,
  children
}: {
  backgroundSrc?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative h-full overflow-hidden">
      {backgroundSrc ? (
        <Image src={backgroundSrc} alt="" fill priority className="z-0 object-cover" aria-hidden />
      ) : null}
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}
