import Image from "next/image";

export function CertificatesModalContent() {
  return (
    <div className="flex h-full min-h-[420px] flex-col gap-4">
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4 text-sm leading-6 lg:basis-1/3">
        <p>
          Подарочный сертификат на:
          <br />
          любую услугу
          <br />
          любую сумму
          <br />
          Возможен электронный и печатный формат.
          <br />
          Срок действия: 1 год
        </p>
      </div>
      <div className="relative min-h-[220px] flex-1 overflow-hidden rounded-xl border border-[var(--border)] lg:basis-2/3">
        <Image src="/sertificates/1.png" alt="Подарочный сертификат" fill className="object-contain bg-white" sizes="(max-width: 1024px) 100vw, 50vw" />
      </div>
    </div>
  );
}
