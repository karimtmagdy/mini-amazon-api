import { z } from "zod";

// pagination schema
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().min(1).default(1),
  limit: z.coerce.number().int().positive().min(1).max(50).default(10),
  total: z.coerce.number().int().positive().default(0),
  pages: z.coerce.number().int().positive().default(0),
  results: z.coerce.number().int().positive().default(0),
});
export type Pagination = z.infer<typeof paginationSchema>;
export interface APIFeaturesResult<T> {
  data: T[];
  pagination: Pagination;
}

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

export type DateParam = z.infer<typeof dateParamSchema>;

export const querySchema = z.object({
  search: z.string().min(1).default(""),
  sort: z
    .string()
    .regex(/^(-?[a-zA-Z_]+)(,-?[a-zA-Z_]+)*$/)
    .default("-createdAt"),
  page: z.coerce.number().int().positive().min(1).default(1),
  limit: z.coerce.number().int().positive().min(1).max(50).default(10),
  skip: z.number().default(0),
  fields: z.string().default(""),
});

export type QueryString = z.infer<typeof querySchema>;
// export type ListQuery = QueryString;

export const baseResponseSchema = z.object({
  status: z.enum(["success", "fail", "error"]),
  message: z.string().optional(),
  meta: paginationSchema.optional(),
});

export const globalResponseSchema = baseResponseSchema.extend({
  data: z.unknown().optional(),
});

export const errorResponseSchema = baseResponseSchema.extend({
  status: z.literal("error"),
  error: z.object({
    code: z.string(),
    details: z.any().optional(),
  }),
});

export type GlobalResponse<T> = Omit<
  z.infer<typeof globalResponseSchema>,
  "data"
> & {
  data: T;
};
export type ErrorResponse = z.infer<typeof errorResponseSchema>;
export const multipleBulkDeleteZod = z.object({
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
export type BulkDelete = z.infer<typeof multipleBulkDeleteZod>["body"];
