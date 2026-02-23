import { NextFunction, Request, Response } from "express";
import { env } from "../lib/env";
import { z } from "zod";
import { Error as MongooseError } from "mongoose";
import { ApiError } from "../class/api.error";
import { STATUS_CODE } from "../lib/statuscode";

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  const statusCode = err.statusCode || STATUS_CODE.SERVER_ERROR;
  const message = err.message || "Internal Server Error";

  if (statusCode >= STATUS_CODE.BAD_REQUEST) {
    console.error("❌ ERROR:", {
      status: err.status,
      statusCode,
      message,
      errors: err.errors,
      stack: err.stack,
    });
  }

  // 2. Mongoose Cast Error (Invalid ID, etc.)
  if (err instanceof MongooseError.CastError || err.name === "CastError") {
    return res.status(STATUS_CODE.BAD_REQUEST).json({
      status: "fail",
      message: `Invalid ${err.path}: ${err.value}`,
    });
  }

  // 3. Known App Error
  if (err instanceof ApiError || (err as any).isOperational) {
    return res
      .status((err as any).statusCode || STATUS_CODE.SERVER_ERROR)
      .json({
        status: "fail",
        message: err.message,
      });
  }

  // 4. Mongoose Duplicate Key Error
  if (err.code === 11000) {
    const field = err.keyValue
      ? Object.keys(err.keyValue)[0] || "field"
      : "field";
    return res.status(STATUS_CODE.BAD_REQUEST).json({
      status: "fail",
      message: `${field} already exists`,
    });
  }

  // 5. Zod Validation Error
  if (err instanceof z.ZodError || err.name === "ZodError") {
    const formattedErrors = err.issues.map((issue: z.ZodIssue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
    const summaryMessage = err.issues[0]?.message || "Validation Error";
    return res.status(STATUS_CODE.BAD_REQUEST).json({
      status: "fail",
      message: summaryMessage,
      errors: formattedErrors,
    });
  }

  // Final fallback (if no specific error matched)
  return res.status(statusCode).json({
    code: statusCode,
    message,
    stack: env.nodeEnv === "development" ? err.stack : undefined,
  });
}
