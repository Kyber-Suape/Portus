import { apiClient } from "@/lib/api/client";
import type { PermissionSummary, RoleDefaultsResponse, UserPermissionDetail } from "@/types/permissions";
import type { UserRole } from "@/types/user";

export const permissionsService = {
  getCatalog(): Promise<PermissionSummary[]> {
    return apiClient.get<PermissionSummary[]>("/permissions", { auth: false });
  },

  getRoleDefaults(role: UserRole): Promise<RoleDefaultsResponse> {
    return apiClient.get<RoleDefaultsResponse>(`/roles/${role}/permissions`, { auth: false });
  },

  getUserPermissions(userId: string): Promise<UserPermissionDetail[]> {
    return apiClient.get<UserPermissionDetail[]>(`/users/${userId}/permissions`);
  },

  updateUserPermissions(userId: string, permissionKeys: string[]): Promise<UserPermissionDetail[]> {
    return apiClient.patch<UserPermissionDetail[]>(`/users/${userId}/permissions`, { permissionKeys });
  },
};
