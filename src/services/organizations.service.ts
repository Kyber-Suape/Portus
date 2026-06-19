import { apiClient } from "@/lib/api/client";
import type { Organization, UpdateOrganizationRequest } from "@/types/organization";

export const organizationsService = {
  getMine(): Promise<Organization> {
    return apiClient.get<Organization>("/organizations/me");
  },

  updateMine(payload: UpdateOrganizationRequest): Promise<Organization> {
    return apiClient.patch<Organization>("/organizations/me", payload);
  },
};
