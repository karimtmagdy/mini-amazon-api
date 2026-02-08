import type { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import { z } from "zod";
import { logger } from "../lib/logger";
import { ApiError } from "../class/api.error";

export const validate =
  <T extends z.ZodTypeAny>(
    schema: T,
    source: "body" | "query" | "params" | "cookies" | "all" = "all",
  ) =>
  (req: Request, _: Response, next: NextFunction) => {
    try {
      if (source === "all") {
        logger.log("Validating:", req.method, req.originalUrl);
        // Ensure strictly objects, even if empty
        const parsed = schema.parse({
          body: req.body || {},
          query: req.query || {},
          params: req.params || {},
          cookies: req.cookies || {},
        }) as any;
        if (parsed.body) req.body = parsed.body;
        if (parsed.query) req.query = parsed.query;
        if (parsed.params) req.params = parsed.params;
        if (parsed.cookies) req.cookies = parsed.cookies;
      } else {
        const parsed = schema.parse(req[source] || {});
        req[source] = parsed;
      }
      next();
    } catch (error) {
      next(error);
    }
  };
export function InValidID(id: string | Types.ObjectId) {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(`invalid-${String(id)}`, 400);
  }
}
export const IdParamSchema: z.ZodObject = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId"),
});
