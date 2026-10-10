"use client";

import { useTheme } from "next-themes";
import { Loader2Icon } from "lucide-react";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import {
  IconAlerta,
  IconCheck,
  IconPagamentoRecusado,
} from "@/components/icons";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <IconCheck className="size-4" decorative />,
        info: <IconAlerta className="size-4" decorative />,
        warning: <IconAlerta className="size-4" decorative />,
        error: <IconPagamentoRecusado className="size-4" decorative />,
        loading: <Loader2Icon className="size-4 animate-spin" aria-hidden />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
