import { z } from "zod/v4";

export const paginationSchema = z.object({
  page: z.number().int().positive().min(1).default(1),
  limit: z.number().int().positive().min(1).max(50).default(10),
  total: z.number().int().positive().default(0),
  pages: z.number().int().positive().default(0),
  results: z.number().int().positive().default(0),
}) satisfies z.ZodType<{
  page: number;
  limit: number;
  total: number;
  pages: number;
  results: number;
}>;

export type Pagination = z.infer<typeof paginationSchema>;
export interface APIFeaturesResult<T> {
  data: T[];
  pagination: Pagination;
}
const successResponse = z.object({
  status: z.literal("success"),
  data: z.unknown().or(z.array(z.unknown())),
});

const errorResponse = z.object({
  status: z.enum(["error", "fail"]),
  error: z.string(),
  message: z.string(),
});

const apiResponse = z.discriminatedUnion("status", [
  successResponse,
  errorResponse,
]);
export type ResponseType = z.infer<typeof apiResponse>;
// في pagination.schema.ts
export const paginationSchema2 = z.object({
  page: z.number()
    .int()
    .positive()
    .min(1)
    .default(1)
    .meta({ 
      description: "Current page number",
      example: 1 
    }),
  
  limit: z.number()
    .int()
    .positive()
    .min(1)
    .max(100)
    .default(10)
    .meta({ 
      description: "Items per page",
      example: 10,
      maxAllowed: 100 
    }),
  
  total: z.number()
    .int()
    .positive()
    .default(0)
    .meta({ 
      description: "Total number of items",
      computed: true 
    }),
});

// استخدام الـ metadata في API documentation
function generateApiDocs(schema: z.ZodObject<any>) {
  Object.entries(schema.shape).forEach(([key, field]) => {
    const meta = (field as any)._def.meta;
    console.log(`${key}: ${meta?.description}`);
    console.log(`  Example: ${meta?.example}`);
  });
}
// برضو مقولتليش ال loose وفيه حاجات مختلفه تاني انت مغطتش كله وازي اقدر اتعامل مع ال register مفهمتش فيدتها برضو ولا ال meta هل بستفاد منها فيه pagination مثلا ؟