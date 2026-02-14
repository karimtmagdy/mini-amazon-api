import { z } from "zod";
import { CATEGORY_STATUS } from "../contract/category.dto";

export const categoryZod = z
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
      slug: z.string().readonly(),
    }),
  })
  .strict();

export const createCategoryZod = z
  .object({
    body: categoryZod.shape.body.omit({
      slug: true,
    }),
  })
  .strict();

export const updateCategoryZod = z
  .object({
    body: categoryZod.shape.body
      .pick({
        name: true,
        description: true,
        status: true,
      })
      .refine((data) => data.status, {
        message: "select a valid status",
      }),
  })
  .strict();

export type CreateCategory = z.infer<typeof createCategoryZod>["body"];
export type UpdateCategory = z.infer<typeof updateCategoryZod>["body"];
