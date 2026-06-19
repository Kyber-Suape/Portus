import type { ApiErrorDetail, ApiErrorResponse, ApiSuccessResponse } from "@/types/api";
import { getToken } from "./token-storage";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000/api";

export class ApiError extends Error {
  readonly status: number;
  readonly errors?: ApiErrorDetail[];

  constructor(status: number, message: string, errors?: ApiErrorDetail[]) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

type UnauthorizedHandler = () => void;
let unauthorizedHandler: UnauthorizedHandler | null = null;

/** Registrado pelo AuthProvider para reagir a um 401 (token expirado/inválido) sem import circular com o router. */
export function setUnauthorizedHandler(handler: UnauthorizedHandler | null): void {
  unauthorizedHandler = handler;
}

interface RequestOptions {
  body?: unknown;
  /** Quando `false`, não envia o cabeçalho Authorization mesmo que haja um token salvo. */
  auth?: boolean;
  signal?: AbortSignal;
}

async function request<T>(method: string, path: string, options: RequestOptions = {}): Promise<T> {
  const { body, auth = true, signal } = options;
  const isFormData = body instanceof FormData;
  const headers = new Headers();
  // Em FormData, o navegador define o Content-Type (multipart/form-data; boundary=...) sozinho.
  if (!isFormData) headers.set("Content-Type", "application/json");

  if (auth) {
    const token = getToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: isFormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
      signal,
    });
  } catch {
    throw new ApiError(0, "Não foi possível conectar ao servidor. Verifique sua conexão.");
  }

  const payload = (await response.json().catch(() => null)) as
    | ApiSuccessResponse<T>
    | ApiErrorResponse
    | null;

  if (!response.ok) {
    if (response.status === 401 && path !== "/auth/login") {
      unauthorizedHandler?.();
    }
    throw new ApiError(
      response.status,
      payload?.message ?? "Ocorreu um erro inesperado.",
      payload && !payload.success ? payload.errors : undefined,
    );
  }

  return (payload as ApiSuccessResponse<T>).data;
}

export const apiClient = {
  get: <T>(path: string, options?: Omit<RequestOptions, "body">) => request<T>("GET", path, options),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>("POST", path, { ...options, body }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>("PATCH", path, { ...options, body }),
  delete: <T>(path: string, options?: Omit<RequestOptions, "body">) => request<T>("DELETE", path, options),
};
