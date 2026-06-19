export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message: string;
}

export interface ApiErrorDetail {
  field?: string;
  message: string;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: ApiErrorDetail[];
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface PaginatedData<T> {
  items: T[];
  meta: PaginationMeta;
}
