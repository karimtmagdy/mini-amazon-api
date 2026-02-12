import { ApiError } from "./api.error";

export class ErrorFactory extends ApiError {
  constructor(statusCode: number, message: string) {
    super(message, statusCode);
  }
  // إنشاء نسخة سريعة لخطأ عام
  static create(statusCode = 400, message = "Global Request Error") {
    return new ErrorFactory(statusCode, message);
  }
  // أخطاء الـ JWT (نستخدم Throw لضمان توقف الكود)
  static throwJWTInvalid() {
    throw new ApiError(
      "Invalid token format or signature. Please log in again.",
      401,
    );
  }
  static throwJWTExpired() {
    throw new ApiError("Your session has expired. Please login again.", 401);
  }
  static throwPermissionDenied() {
    throw new ApiError(
      "You do not have permission to perform this action",
      403,
    );
  }
  // خطأ عام للنظام
  static throwInternal(message = "Something went wrong") {
    throw new ApiError(message, 500);
  }
}
