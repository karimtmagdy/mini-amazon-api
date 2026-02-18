import { NextFunction, Request, Response } from "express";
import { env } from "../lib/env";
import { z } from "zod";
import { Error as MongooseError } from "mongoose";
import { ApiError } from "../class/api.error";

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  // 2. Mongoose Cast Error (Invalid ID, etc.)
  if (err instanceof MongooseError.CastError || err.name === "CastError") {
    return res.status(400).json({
      status: "fail",
      message: `Invalid ${err.path}: ${err.value}`,
    });
  }

  // 3. Known App Error
  if (err instanceof ApiError || (err as any).isOperational) {
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
    const formatts = err.issues.map((issue: z.ZodIssue) => ({
      field: issue.path.slice(0).join("."),
      message: issue.message,
    }));
    // const firstMessage = err.issues[0]?.message;
    return res.status(400).json({
      status: "fail",
      // message: firstMessage,
      errors: formatts,
      // ...formatts[0]
    });
  }

  // Final fallback (if no specific error matched)
  return res.status(statusCode).json({
    code: statusCode,
    message,
    stack: env.nodeEnv === "development" ? err.stack : undefined,
  });
}
