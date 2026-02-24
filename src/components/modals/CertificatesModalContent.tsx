import Image from "next/image";

export function CertificatesModalContent() {
  return (
    <div className="space-y-4 text-sm leading-relaxed">
      <p className="whitespace-pre-line">{`Подарочный сертификат на:
любую услугу
любую сумму
Возможен электронный и печатный формат.
Срок действия: 1 год`}</p>
      <Image src="/sertificates/1.png" alt="Подарочный сертификат" width={520} height={520} className="h-auto w-full rounded-lg" />
    </div>
  );
}
