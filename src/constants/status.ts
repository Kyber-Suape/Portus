import type { UserStatus } from "@/types/user";

export type StatusTone = "primary" | "accent" | "success" | "warning" | "danger" | "muted";

export const USER_STATUS_CONFIG: Record<UserStatus, { label: string; tone: StatusTone }> = {
  ACTIVE: { label: "Ativo", tone: "success" },
  INVITED: { label: "Convidado", tone: "warning" },
  INACTIVE: { label: "Inativo", tone: "muted" },
};
