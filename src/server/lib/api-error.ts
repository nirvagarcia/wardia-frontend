export class ApiError extends Error {
  constructor(
    public override readonly message: string,
    public readonly statusCode: number = 500
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function handleRouteError(err: unknown): { message: string; statusCode: number } {
  if (err instanceof ApiError) {
    return { message: err.message, statusCode: err.statusCode };
  }
  return {
    message: err instanceof Error ? err.message : "Internal server error",
    statusCode: 500,
  };
}
