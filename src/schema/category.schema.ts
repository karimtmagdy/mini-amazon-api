import { z } from "zod/v4";
import { CATEGORY_STATUS } from "../contract/category.dto";

export const defaultCategoryZod = z
  .object({
    body: z.object({
      name: z
        .string({ message: "Category name is required" })
        .min(3, { message: "Category name must be at least 3 characters long" })
        .max(30, {
          message: "Category name must be at most 30 characters long",
        }),
      description: z
        .string({ message: "Category description is required" })
        .min(10, {
          message: "Category description must be at least 10 characters long",
        })
        .max(100, {
          message: "Category description must be at most 100 characters long",
        }),
      status: z.enum(CATEGORY_STATUS).default("active"),
      image: z.object({ url: z.string(), publicId: z.string() }).optional(),
    }),
  })
  .strict();

export const createCategoryZod = defaultCategoryZod.shape.body.clone().strict();

export const updateCategoryZod = defaultCategoryZod.shape.body
  .pick({
    name: true,
    description: true,
    status: true,
  })
  .refine((data) => data.status, {
    message: "select a valid status",
  })
  .strict();

export type CreateCategory = z.infer<typeof createCategoryZod>;
export type UpdateCategory = z.infer<typeof updateCategoryZod>;
