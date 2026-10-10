"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconCadeado, IconMenu, IconSetaDireita } from "@/components/icons";
import { useState } from "react";
import { BrandLogo } from "@/components/brand-logo";
import { SiteCtaButton } from "@/components/marketing/site-cta";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { resolveSiteHref, site } from "@/content/site";
import { cn } from "@/lib/utils";

function MarketingNavLinks({
  className,
  onNavigate,
}: {
  className?: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className={cn("flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-6", className)}>
      {site.nav.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          onClick={onNavigate}
          className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}

export function SiteHeader({ demoModeActive = false }: { demoModeActive?: boolean }) {
  const pathname = usePathname();
  const isCheckout = pathname.startsWith("/checkout");
  const [menuOpen, setMenuOpen] = useState(false);
  const header = site.header;
  const stickyTop = demoModeActive ? "top-9" : "top-0";

  if (isCheckout) {
    return (
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 lg:px-8">
          <BrandLogo />
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="hidden text-sm sm:inline-flex"
              render={<Link href="/" />}
            >
              <IconSetaDireita decorative className="size-4 rotate-180" data-icon="inline-start" />
              {header.checkoutBack}
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>
    );
  }

  const headerCta = site.headerCta;

  return (
    <header
      className={cn(
        "sticky z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80",
        stickyTop,
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 lg:px-8">
        <BrandLogo />
        <MarketingNavLinks className="hidden lg:flex" />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <SiteCtaButton
            cta={headerCta}
            className="hidden h-10 px-4 sm:inline-flex"
          >
            <IconSetaDireita decorative className="size-4" data-icon="inline-end" />
          </SiteCtaButton>
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger
              className="lg:hidden"
              render={
                <Button
                  variant="outline"
                  size="icon"
                  aria-label={header.menuOpenLabel}
                  title={header.menuOpenLabel}
                />
              }
            >
              <IconMenu decorative className="size-4" />
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-xs">
              <SheetHeader>
                <SheetTitle className="text-left">{header.menuTitle}</SheetTitle>
              </SheetHeader>
              <div className="mt-6 flex flex-col gap-6">
                <MarketingNavLinks onNavigate={() => setMenuOpen(false)} />
                <Separator />
                <SiteCtaButton
                  cta={headerCta}
                  className="w-full"
                  onNavigate={() => setMenuOpen(false)}
                >
                  <IconSetaDireita decorative className="size-4" data-icon="inline-end" />
                </SiteCtaButton>
                <SiteCtaButton
                  cta={site.hero.secondaryCta}
                  variant="outline"
                  className="w-full"
                  onNavigate={() => setMenuOpen(false)}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  const pathname = usePathname();
  const isCheckout = pathname.startsWith("/checkout");
  const footer = site.footer;

  if (isCheckout) {
    const checkoutFooter = footer.checkout;
    return (
      <footer className="mt-auto border-t">
        <div className="text-muted-foreground mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-8 text-sm lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <p>{footer.copyright}</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="inline-flex items-center gap-1.5">
              <IconCadeado decorative className="size-3.5" />
              {checkoutFooter.secure}
            </span>
            <Link href="/#contato" className="hover:text-foreground">
              {checkoutFooter.terms}
            </Link>
            <Link href="/#contato" className="hover:text-foreground">
              {checkoutFooter.privacy}
            </Link>
            <Link href="/#contato" className="hover:text-foreground">
              {checkoutFooter.support}
            </Link>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="mt-auto border-t bg-background">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr]">
          <div className="space-y-4">
            <BrandLogo href="/" />
            <p className="text-muted-foreground max-w-sm text-sm text-pretty">
              {footer.description}
            </p>
          </div>
          <div>
            <p className="mb-3 text-sm font-semibold">{footer.navHeading}</p>
            <ul className="text-muted-foreground space-y-2 text-sm">
              {site.nav.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href={resolveSiteHref("repoUrl")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground"
                >
                  {footer.githubLink}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <Separator className="my-8" />
        <div className="text-muted-foreground flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p>{footer.copyright}</p>
          <p className="inline-flex items-center gap-1.5">
            <IconCadeado decorative className="size-3.5" />
            {footer.securePayments}
          </p>
        </div>
      </div>
    </footer>
  );
}
