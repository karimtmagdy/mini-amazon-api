import { ApiError } from "./api.error";
import { STATUS_CODE } from "../lib/statuscode";

export class ErrorFactory extends ApiError {
  constructor(statusCode: number, message: string) {
    super(message, statusCode);
  }
  // إنشاء نسخة سريعة لخطأ عام
  static create(
    statusCode = STATUS_CODE.BAD_REQUEST,
    message = "Global Request Error",
  ) {
    return new ErrorFactory(statusCode, message);
  }
  static throwNotFound(message = "Not Found"): never {
    throw new ApiError(message, STATUS_CODE.NOT_FOUND);
  }
  static throwBadRequest(message = "Bad Request"): never {
    throw new ApiError(message, STATUS_CODE.BAD_REQUEST);
  }
  static throwUnauthorized(message = "Unauthorized"): never {
    throw new ApiError(message, STATUS_CODE.UNAUTHORIZED);
  }
  static throwForbidden(message = "Forbidden"): never {
    throw new ApiError(message, STATUS_CODE.FORBIDDEN);
  }
  static throwServerError(message = "Server Error"): never {
    throw new ApiError(message, STATUS_CODE.SERVER_ERROR);
  }
  // أخطاء الـ JWT (نستخدم Throw لضمان توقف الكود)
  static throwJWTInvalid(): never {
    throw new ApiError(
      "Invalid token format or signature. Please log in again.",
      STATUS_CODE.UNAUTHORIZED,
    );
  }
  static throwJWTExpired(): never {
    throw new ApiError(
      "Your session has expired. Please login again.",
      STATUS_CODE.UNAUTHORIZED,
    );
  }
  static throwPermissionDenied(): never {
    throw new ApiError(
      "You do not have permission to perform this action",
      STATUS_CODE.FORBIDDEN,
    );
  }
  // خطأ عام للنظام
  static throwInternal(message = "Something went wrong"): never {
    throw new ApiError(message, STATUS_CODE.SERVER_ERROR);
  }
}
