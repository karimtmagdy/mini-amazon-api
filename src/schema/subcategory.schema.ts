import { z } from "zod";
import { CATEGORY_STATUS, CategoryStatusEnum } from "../contract/category.dto";

const defaultSubCategoryZod = z.object({
  body: z.object({
    name: z
      .string({ message: "sub category name is required" })
      .min(2, { message: "Name must be at least 2 characters" })
      .max(32, { message: "Name must be at most 32 characters" }),
    description: z
      .string()
      .min(10, { message: "Description must be at least 10 characters" })
      .max(500, { message: "Description must be at most 500 characters" })
      .optional(),
    category: z.array(z.string()).min(1, "At least one category is required"),
    status: z.enum(CATEGORY_STATUS).default(CategoryStatusEnum.ACTIVE),
  }),
});

export const createSubCategoryZod = defaultSubCategoryZod.shape.body.clone();
export const updateSubCategoryZod = defaultSubCategoryZod.shape.body
  .clone()
  .partial();

export type CreateSubCategory = z.infer<typeof createSubCategoryZod>;
export type UpdateSubCategory = z.infer<typeof updateSubCategoryZod>;
