import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

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
      className={cn("inline-flex items-center gap-2.5", className)}
    >
      <span
        className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm"
        aria-hidden
      >
        <ShieldCheck className="size-5" strokeWidth={2.25} />
      </span>
      <span className="font-heading text-base font-bold tracking-tight">
        Will They Pay
      </span>
    </Link>
  );
}
