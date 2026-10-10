import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { WTP_ICON_LABELS } from "@/components/icons/icon-labels";

const logoLabel = WTP_ICON_LABELS["logo-mark"]?.ariaLabel ?? "Will They Pay, página inicial";

export function BrandLogo({
  className,
  href = "/",
}: {
  className?: string;
  href?: string;
}) {
  return (
    <Link
      href={href}
      aria-label={logoLabel}
      className={cn("inline-flex items-center gap-2.5", className)}
    >
      <span className="relative size-9 shrink-0" aria-hidden>
        <Image
          src="/brand/logo-mark-color.svg"
          alt=""
          width={36}
          height={36}
          className="size-9 dark:hidden"
          priority
        />
        <Image
          src="/brand/logo-mark-color-dark.svg"
          alt=""
          width={36}
          height={36}
          className="hidden size-9 dark:block"
          priority
        />
      </span>
      <span className="font-heading text-base font-bold tracking-tight">
        Will They Pay
      </span>
    </Link>
  );
}
