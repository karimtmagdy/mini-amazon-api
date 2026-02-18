import { z } from "zod/v4";
// pagination schema
export const paginationZod = z.object({
  page: z.coerce.number().int().positive().min(1).default(1),
  limit: z.coerce.number().int().positive().min(1).max(50).default(10),
  total: z.coerce.number().int().positive().default(0),
  pages: z.coerce.number().int().positive().default(0),
  results: z.coerce.number().int().positive().default(0),
});
export type Pagination = z.infer<typeof paginationZod>;
export interface APIFeaturesResult<T> {
  data: T[];
  pagination: Pagination;
}
export const mongoIdRegex: RegExp = /^[0-9a-fA-F]{24}$/;
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

export const baseResponseZod = z.object({
  status: z.enum(["success", "fail", "error"]),
  message: z.string().optional(),
});

export const responseWithMetaZod = baseResponseZod.extend({
  data: z.unknown().optional(),
  meta: paginationZod.optional(),
});
export type ResponseWithMeta<T> = Omit<
  z.infer<typeof responseWithMetaZod>,
  "data"
> & {
  data: T;
};
export const responseZod = baseResponseZod.extend({
  data: z.unknown(),
});
export type ResponseZod<T> = Omit<z.infer<typeof responseZod>, "data"> & {
  data: T;
};
// export const sendResponse = <T>(
//   res: Response,
//   schema: z.ZodSchema,
//   payload: T,
//   // message:string
// ) => {
//   const validated = schema.parse(payload);
//   return res.json(validated);
// };

export const multipleBulkDeleteZod = z.object({
  body: z.object({
    ids: z
      .array(z.string().regex(mongoIdRegex, "Invalid MongoDB IDs"))
      .min(1, {
        message: "At least one ID is required",
      })
      .max(100, {
        message: "Cannot delete more than 100 products at once",
      }),
  }),
});
export type BulkDelete = z.infer<typeof multipleBulkDeleteZod>["body"];
