import { apiClient } from "@/lib/api/client";
import type { PaginatedData } from "@/types/api";
import type { CreateUserRequest, ListUsersQuery, UpdateUserRequest, User } from "@/types/user";

function buildQueryString(query: ListUsersQuery): string {
  const params = new URLSearchParams();
  if (query.page) params.set("page", String(query.page));
  if (query.pageSize) params.set("pageSize", String(query.pageSize));
  if (query.role) params.set("role", query.role);
  if (query.status) params.set("status", query.status);
  if (query.q) params.set("q", query.q);

  const queryString = params.toString();
  return queryString ? `?${queryString}` : "";
}

export const usersService = {
  list(query: ListUsersQuery = {}): Promise<PaginatedData<User>> {
    return apiClient.get<PaginatedData<User>>(`/users${buildQueryString(query)}`);
  },

  create(payload: CreateUserRequest): Promise<User> {
    return apiClient.post<User>("/users", payload);
  },

  update(id: string, payload: UpdateUserRequest): Promise<User> {
    return apiClient.patch<User>(`/users/${id}`, payload);
  },

  remove(id: string): Promise<null> {
    return apiClient.delete<null>(`/users/${id}`);
  },
};
