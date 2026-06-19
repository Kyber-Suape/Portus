import { apiClient } from "@/lib/api/client";
import type {
  LoginRequest,
  LoginResponse,
  MeResponse,
  RegisterRequest,
  RegisterResponse,
  UpdateMeInput,
} from "@/types/auth";
import type { User } from "@/types/user";

export const authService = {
  register(payload: RegisterRequest): Promise<RegisterResponse> {
    return apiClient.post<RegisterResponse>("/auth/register", payload, { auth: false });
  },

  login(payload: LoginRequest): Promise<LoginResponse> {
    return apiClient.post<LoginResponse>("/auth/login", payload, { auth: false });
  },

  me(): Promise<MeResponse> {
    return apiClient.get<MeResponse>("/auth/me");
  },

  updateMe(payload: UpdateMeInput): Promise<User> {
    return apiClient.patch<User>("/auth/me", payload);
  },
};
