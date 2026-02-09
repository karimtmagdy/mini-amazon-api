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