import Link from "next/link";
import { IconAlerta } from "@/components/icons";
import { site } from "@/content/site";

export function DemoBanner() {
  const copy = site.demoBanner;

  return (
    <div
      role="status"
      className="sticky top-0 z-[60] min-h-9 border-b border-warning-foreground/15 bg-warning text-warning-foreground"
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-center gap-3 px-4 py-1.5 text-xs sm:justify-between sm:text-sm lg:px-8">
        <div className="flex min-w-0 items-center gap-2 text-center sm:text-left">
          <IconAlerta decorative className="size-4 shrink-0" />
          <p className="min-w-0 font-medium leading-snug">
            <span className="hidden sm:inline">{copy.desktop}</span>
            <span className="sm:hidden">{copy.mobile}</span>
          </p>
        </div>
        <Link
          href={site.repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 font-semibold whitespace-nowrap underline-offset-2 hover:underline"
        >
          {copy.linkLabel}
        </Link>
      </div>
    </div>
  );
}
