import Link from "next/link";
import { resolveSiteHref } from "@/content/site";
import { Button } from "@/components/ui/button";
import type { ComponentProps } from "react";

type Cta = { label: string; href: string };

function hrefFor(cta: Cta) {
  return resolveSiteHref(cta.href);
}

function isExternal(href: string) {
  return href.startsWith("http");
}

export function SiteCtaButton({
  cta,
  className,
  size = "default",
  variant = "default",
  children,
  onNavigate,
}: {
  cta: Cta;
  className?: string;
  size?: ComponentProps<typeof Button>["size"];
  variant?: ComponentProps<typeof Button>["variant"];
  children?: React.ReactNode;
  onNavigate?: () => void;
}) {
  const href = hrefFor(cta);
  const content =
    children === undefined ? (
      cta.label
    ) : (
      <>
        {cta.label}
        {children}
      </>
    );

  if (isExternal(href)) {
    return (
      <Button
        size={size}
        variant={variant}
        className={className}
        render={
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onNavigate}
          />
        }
      >
        {content}
      </Button>
    );
  }

  return (
    <Button
      size={size}
      variant={variant}
      className={className}
      render={<Link href={href} onClick={onNavigate} />}
    >
      {content}
    </Button>
  );
}

