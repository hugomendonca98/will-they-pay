import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { DemoBanner } from "@/components/demo-banner";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { isDemoModeEnabled } from "@/lib/demo-mode";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { site } from "@/content/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: site.metadata.title,
  description: site.metadata.description,
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const demoMode = await isDemoModeEnabled();

  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${inter.variable} ${plusJakarta.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <ThemeProvider>
          {demoMode ? <DemoBanner /> : null}
          <SiteHeader demoModeActive={demoMode} />
          {children}
          <SiteFooter />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
