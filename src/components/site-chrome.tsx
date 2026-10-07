import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader() {
  return (
    <header className="bg-background/80 border-b backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4">
        <Link href="/" className="font-heading text-sm font-semibold tracking-tight">
          Will They Pay
        </Link>
        <nav className="flex items-center gap-3 text-sm">
          <Link href="/#leads" className="text-muted-foreground hover:text-foreground">
            Captura de leads
          </Link>
          <Link href="/#checkout" className="text-muted-foreground hover:text-foreground">
            Checkout
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t">
      <div className="text-muted-foreground mx-auto flex w-full max-w-5xl flex-col gap-1 px-4 py-6 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p>Template SaaS para Cloudflare Workers, D1 e Mercado Pago.</p>
        <p>Copy em português. Código em inglês.</p>
      </div>
    </footer>
  );
}
