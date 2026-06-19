import type { UserRole } from "@/types/user";

export interface PermissionSummary {
  key: string;
  feature: string;
  action: string;
  description: string | null;
}

export interface UserPermissionDetail extends PermissionSummary {
  granted: boolean;
  source: "role" | "override";
}

export interface RoleDefaultsResponse {
  role: UserRole;
  permissionKeys: string[];
}
