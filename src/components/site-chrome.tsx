"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, ArrowRight, Lock, Menu } from "lucide-react";
import { useState } from "react";
import { BrandLogo } from "@/components/brand-logo";
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
import { cn } from "@/lib/utils";

const MARKETING_LINKS = [
  { href: "/#recursos", label: "Recursos" },
  { href: "/#precos", label: "Preços" },
  { href: "/#faq", label: "FAQ" },
  { href: "/#contato", label: "Contato" },
] as const;

function MarketingNavLinks({
  className,
  onNavigate,
}: {
  className?: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className={cn("flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-6", className)}>
      {MARKETING_LINKS.map((link) => (
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

export function SiteHeader() {
  const pathname = usePathname();
  const isCheckout = pathname.startsWith("/checkout");
  const [menuOpen, setMenuOpen] = useState(false);

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
              <ArrowLeft data-icon="inline-start" />
              Voltar ao site
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 lg:px-8">
        <BrandLogo />
        <MarketingNavLinks className="hidden lg:flex" />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            size="default"
            className="hidden h-10 px-4 sm:inline-flex"
            render={<Link href="/#precos" />}
          >
            Começar agora
            <ArrowRight data-icon="inline-end" />
          </Button>
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger
              className="lg:hidden"
              render={
                <Button variant="outline" size="icon" aria-label="Abrir menu" />
              }
            >
              <Menu />
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-xs">
              <SheetHeader>
                <SheetTitle className="text-left">Menu</SheetTitle>
              </SheetHeader>
              <div className="mt-6 flex flex-col gap-6">
                <MarketingNavLinks onNavigate={() => setMenuOpen(false)} />
                <Separator />
                <Button
                  className="w-full"
                  render={<Link href="/#precos" onClick={() => setMenuOpen(false)} />}
                >
                  Começar agora
                  <ArrowRight data-icon="inline-end" />
                </Button>
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

  if (isCheckout) {
    return (
      <footer className="mt-auto border-t">
        <div className="text-muted-foreground mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-8 text-sm lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <p>© 2026 Will They Pay. Todos os direitos reservados.</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="inline-flex items-center gap-1.5">
              <Lock className="size-3.5" />
              Pagamento seguro
            </span>
            <Link href="/#contato" className="hover:text-foreground">Termos</Link>
            <Link href="/#contato" className="hover:text-foreground">Privacidade</Link>
            <Link href="/#contato" className="hover:text-foreground">Suporte</Link>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="mt-auto border-t bg-background">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,minmax(0,1fr))]">
          <div className="space-y-4">
            <BrandLogo href="/" />
            <p className="text-muted-foreground max-w-xs text-sm text-pretty">
              Template SaaS para o mercado brasileiro. Substitua esta descrição pela
              missão do seu produto.
            </p>
          </div>
          <div>
            <p className="mb-3 text-sm font-semibold">Produto</p>
            <ul className="text-muted-foreground space-y-2 text-sm">
              <li><Link href="/#recursos" className="hover:text-foreground">Recursos</Link></li>
              <li><Link href="/#precos" className="hover:text-foreground">Preços</Link></li>
              <li><Link href="/#faq" className="hover:text-foreground">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <p className="mb-3 text-sm font-semibold">Empresa</p>
            <ul className="text-muted-foreground space-y-2 text-sm">
              <li><Link href="/#contato" className="hover:text-foreground">Sobre</Link></li>
              <li><Link href="/#contato" className="hover:text-foreground">Contato</Link></li>
              <li><Link href="/#contato" className="hover:text-foreground">Blog</Link></li>
            </ul>
          </div>
          <div>
            <p className="mb-3 text-sm font-semibold">Legal</p>
            <ul className="text-muted-foreground space-y-2 text-sm">
              <li><Link href="/#contato" className="hover:text-foreground">Termos de uso</Link></li>
              <li><Link href="/#contato" className="hover:text-foreground">Privacidade</Link></li>
              <li><Link href="/#contato" className="hover:text-foreground">LGPD</Link></li>
            </ul>
          </div>
        </div>
        <Separator className="my-8" />
        <div className="text-muted-foreground flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Will They Pay. Todos os direitos reservados.</p>
          <p className="inline-flex items-center gap-1.5">
            <Lock className="size-3.5" />
            Pagamentos processados com segurança
          </p>
        </div>
      </div>
    </footer>
  );
}
