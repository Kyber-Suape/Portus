export type UserRole =
  | "SYSTEM_ADMIN"
  | "SUAPE_INSPECTOR"
  | "EXTERNAL_INSPECTOR"
  | "SUPPLIER"
  | "AUDITOR";

export type UserStatus = "ACTIVE" | "INVITED" | "INACTIVE";

export interface User {
  id: string;
  organizationId: string;
  name: string;
  cpf?: string | null;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  cpf?: string;
  password: string;
  passwordConfirmation: string;
  permissionKeys?: string[];
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  phone?: string;
  cpf?: string;
  role?: UserRole;
  status?: UserStatus;
}

export interface ListUsersQuery {
  page?: number;
  pageSize?: number;
  role?: UserRole;
  status?: UserStatus;
  q?: string;
}
