import { NextFunction, Request, Response } from "express";
import { env } from "../lib/env";
import { z } from "zod";
import { Error as MongooseError } from "mongoose";
import { ApiError } from "../class/api.error";

const ErrorResponseSchema = z.object({
  code: z.number(),
  message: z.string(),
  stack: z.any(),
});

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  const errorResponse = ErrorResponseSchema.safeParse({
    code: statusCode,
    message,
    stack: env.nodeEnv === "development" ? err.stack : {},
  });

  if (!errorResponse.success) {
    res.status(500).json({
      code: 500,
      message: "Internal Server Error",
      stack: env.nodeEnv === "development" ? err.stack : {},
    });
    return;
  }
  // 2. Mongoose Cast Error (Invalid ID, etc.)
  if (err instanceof MongooseError.CastError || err.name === "CastError") {
    return res.status(400).json({
      status: "fail",
      message: `Invalid ${err.path}: ${err.value}`,
    });
  }

  // 3. Known App Error
  if (err instanceof ApiError || err.isOperational) {
    return res.status((err as any).statusCode || 500).json({
      status: "fail",
      message: err.message,
    });
  }

  // 4. Mongoose Duplicate Key Error
  if (err.code === 11000) {
    const field = err.keyValue
      ? Object.keys(err.keyValue)[0] || "field"
      : "field";
    return res.status(400).json({
      status: "fail",
      message: `${field} already exists`,
    });
  }

  // 5. Zod Validation Error
  if (err instanceof z.ZodError || err.name === "ZodError") {
    const issues = err.issues || [];
    const firstIssue = issues[0];

    const mainIssue = firstIssue
      ? `Invalid ${firstIssue.path.join(".")}: ${firstIssue.message}.`
      : "Validation failed";

    const formattedErrors = issues.map((issue: z.ZodIssue) => ({
      field: issue.path.join(".") || "unknown",
      message: issue.message,
      code: issue.code,
    }));

    return res.status(400).json({
      status: "fail",
      message: mainIssue,
      errors: formattedErrors,
    });
  }

  // Final fallback (if no specific error matched)
  return res.status(statusCode).json(errorResponse.data);
}
