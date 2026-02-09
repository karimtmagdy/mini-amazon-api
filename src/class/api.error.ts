export class ApiError extends Error {
  status: string;
  // stack?: string;
  isOperational: boolean;
  constructor(
    message: string,
    public statusCode: number,
    // stack?: string,
  ) {
    super(message || "An unknown error occurred");
    this.statusCode = statusCode || 500;
    const statusCodeStr = String(this.statusCode);
    this.status = statusCodeStr.startsWith("4") ? "fail" : "error";
    // this.stack = stack;
    // this.stack = stack;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}
// export const apiError = new ApiError();
