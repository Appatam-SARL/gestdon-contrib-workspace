export type APIResponse<T> = Promise<{
  success?: boolean;
  data: T;
  message?: string;
  metadata?: {
    total: Number;
    page: Number;
    limit: Number;
    totalPages: Number;
    hasNextPage: Boolean;
    hasPrevPage: Boolean;
  };
}>;
