import type { SVGProps } from "react";
import { cn } from "@/lib/utils";
import { WTP_ICON_LABELS } from "./icon-labels";
import { WTP_ICON_PATHS, type WtpIconName } from "./wtp-icon-paths";

export type WtpIconProps = SVGProps<SVGSVGElement> & {
  /** When true, the icon is purely decorative (e.g. next to visible text). */
  decorative?: boolean;
  /** Overrides the default aria-label from copy/icon-labels.json */
  title?: string;
};

export function WtpIcon({
  name,
  className,
  decorative = false,
  title,
  ...props
}: WtpIconProps & { name: WtpIconName }) {
  const meta = WTP_ICON_LABELS[name];
  const ariaLabel = title ?? meta?.ariaLabel ?? meta?.label ?? name;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("size-4 shrink-0", className)}
      aria-hidden={decorative ? true : undefined}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : ariaLabel}
      dangerouslySetInnerHTML={{ __html: WTP_ICON_PATHS[name] }}
      {...props}
    />
  );
}

export function createWtpIcon(name: WtpIconName) {
  function Icon({ className, decorative, title, ...props }: WtpIconProps) {
    return (
      <WtpIcon
        className={className}
        decorative={decorative}
        title={title}
        {...props}
        name={name}
      />
    );
  }
  Icon.displayName = `WtpIcon(${name})`;
  return Icon;
}
