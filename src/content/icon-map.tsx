import type { ComponentType } from "react";
import {
  IconCartao,
  IconEscudo,
  IconSuporte,
  IconUsuarios,
  type WtpIconProps,
} from "@/components/icons";

export const siteIconMap: Record<
  string,
  ComponentType<WtpIconProps>
> = {
  cartao: IconCartao,
  usuarios: IconUsuarios,
  escudo: IconEscudo,
  suporte: IconSuporte,
};

export function getSiteIcon(key: string): ComponentType<WtpIconProps> {
  return siteIconMap[key] ?? IconEscudo;
}
