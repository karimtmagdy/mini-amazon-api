import type { Request, Response, NextFunction } from "express";
import { z } from "zod";

export const validate =
  <T extends z.ZodTypeAny>(
    schema: T,
    source: "body" | "query" | "params" | "cookies" | "all" = "all",
  ) =>
  (req: Request, _: Response, next: NextFunction) => {
    try {
      if (source === "all") {
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
export const idParamZod = z.object({
  params: z.object({
    id: z
      .string({ error: "ID is required" })
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID"),
  }),
}) satisfies z.ZodType<{ params: { id: string } }>;
export type IdParam = z.infer<typeof idParamZod>["params"];
