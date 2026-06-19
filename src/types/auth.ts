import type { Organization, OrganizationType } from "@/types/organization";
import type { User, UserRole } from "@/types/user";

export interface RegisterOrganizationInput {
  name: string;
  legalName: string;
  tradeName: string;
  cnpj: string;
  organizationType: OrganizationType;
  institutionalEmail: string;
  institutionalPhone: string;
  cep: string;
  state: string;
  city: string;
  district: string;
  street: string;
  number: string;
  complement?: string;
  legalResponsibleName: string;
  legalResponsibleCpf: string;
  legalResponsibleEmail: string;
  legalResponsiblePhone: string;
  notes?: string;
}

export interface RegisterAdminInput {
  name: string;
  cpf: string;
  email: string;
  phone: string;
  password: string;
}

export interface RegisterInvitedUserInput {
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  password: string;
  passwordConfirmation: string;
  permissionKeys?: string[];
}

export interface RegisterRequest {
  organization: RegisterOrganizationInput;
  admin: RegisterAdminInput;
  invitedUsers: RegisterInvitedUserInput[];
}

export interface RegisterResponse {
  organization: Organization;
  admin: User;
  invitedUsers: User[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface MeResponse {
  user: User;
  organization: Organization | null;
  permissions: string[];
}

export interface UpdateMeInput {
  name?: string;
  email?: string;
  phone?: string;
  cpf?: string;
  password?: string;
  passwordConfirmation?: string;
}
