import { z } from "zod";

export const emailRegex: RegExp =
  /^[a-zA-Z0-9._%+-]+@(gmail|yahoo|outlook|hotmail)\.(com|net|org)$/;
// const phoneSchema = z
//   .string()
//   .min(10, "Phone number must be at least 10 characters")
//   .max(15, "Phone number must be at most 15 characters");
export const dateParamSchema = z.object({
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  deletedAt: z.iso.datetime(),
});
export const idParamZod = z.object({
  params: z.object({
    id: z
      .string({ error: "ID is required" })
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID"),
  }),
}) satisfies z.ZodType<{ params: { id: string } }>;

export type DateParam = z.infer<typeof dateParamSchema>;
export type IdParam = z.infer<typeof idParamZod>["params"];
export type QueryString = {
  search: string;
  sort: string;
  fields: string;
  page: number;
  limit: number;
  skip: number;
};

/**
 * Query Schema
 * Validates and transforms query parameters for API requests
 *
 * Features:
 * - search: Optional search string (min 1 character)
 * - sort: Comma-separated field names with optional '-' prefix for descending order
 *         Example: "price,-createdAt" (price ascending, createdAt descending)
 * - page: Current page number (coerced from string, min: 1, default: 1)
 * - limit: Items per page (coerced from string, min: 1, max: 50, default: 10)
 * - total: Total documents count (default: 0)
 * - pages: Total pages count (default: 0)
 * - results: Current page results count (default: 0)
 */
export const querySchema = z.object({
  search: z.string().min(1).default(""),
  sort: z.string().regex(/^(-?[a-zA-Z_]+)(,-?[a-zA-Z_]+)*$/), // .default("createdAt"),
  page: z.coerce.number().int().positive().min(1).default(1),
  limit: z.coerce.number().int().positive().min(1).max(50).default(10),
  skip: z.number().default(0),
  fields: z.string().default(""),
}) satisfies z.ZodType<QueryString>;

export type ListQuery = z.infer<typeof querySchema>;
import { paginationSchema } from "./pagination.schema";

export const baseResponseSchema = z.object({
  status: z.enum(["success", "fail", "error"]),
  message: z.string().optional(),
  meta: paginationSchema.optional(),
});
export const errorResponseSchema = baseResponseSchema.extend({
  status: z.literal("error"),
  error: z.object({
    code: z.string(),
    details: z.any().optional(),
  }),
});

export const globalResponseSchema = z.object({
  status: z.enum(["success", "fail", "error"]),
  message: z.string().optional(),
  data: z.unknown().optional(),
  meta: paginationSchema.optional(),
});
export type GlobalResponse<T> = Omit<
  z.infer<typeof globalResponseSchema>,
  "data"
> & {
  data: T;
};
export type ErrorResponse = z.infer<typeof errorResponseSchema>;
export const multipleBulkDeleteSchema = z.object({
  body: z.object({
    ids: z
      .array(z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB IDs"))
      .min(1, {
        message: "At least one ID is required",
      })
      .max(100, {
        message: "Cannot delete more than 100 products at once",
      }),
  }),
});
export type BulkDelete = z.infer<typeof multipleBulkDeleteSchema>["body"];
