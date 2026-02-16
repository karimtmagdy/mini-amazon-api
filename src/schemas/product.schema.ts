import { z } from "zod/v4";
import { PRODUCT_STATUS } from "../contract/product.dto";
import { mongoIdRegex } from "./standred.schema";

export const productZod = z
  .object({
    body: z.object({
      name: z
        .string({ message: "Product name is required" })
        .min(3, { message: "Product name must be at least 3 characters long" })
        .max(100, {
          message: "Product name must be at most 100 characters long",
        }),
      description: z
        .string({ message: "Product description is required" })
        .min(10, {
          message: "Product description must be at least 10 characters long",
        })
        .max(1000, {
          message: "Product description must be at most 1000 characters long",
        }),
      price: z
        .number({ message: "Price is required" })
        .min(0, { message: "Price must be at least 0" })
        .max(1000000, { message: "Price must be at most 1,000,000" }),
      stock: z
        .number({ message: "Stock is required" })
        .min(0, { message: "Stock must be at least 0" }),
      status: z.enum(PRODUCT_STATUS).default("active"),
      category: z
        .array(z.string().regex(mongoIdRegex, "Invalid category ID"))
        .min(1, { message: "Product must belong to at least one category" }),
      subcategory: z
        .array(z.string().regex(mongoIdRegex, "Invalid subcategory ID"))
        .optional(),
      brand: z.string().regex(mongoIdRegex, "Invalid brand ID").optional(),
      discount: z.number().min(0).max(100).default(0),
      colors: z.array(z.string()).optional(),
      tags: z.array(z.string()).max(10).optional(),
      cover: z.object({ url: z.string(), publicId: z.string() }).optional(),
      images: z
        .array(z.object({ url: z.string(), publicId: z.string() }))
        .max(5)
        .optional(),
      sku: z.string().optional(),
      slug: z.string().readonly().optional(),
    }),
  })
  .strict();

export const createProductZod = z
  .object({
    body: productZod.shape.body.omit({
      slug: true,
    }),
  })
  .strict();

export const updateProductZod = z
  .object({
    body: productZod.shape.body.partial(),
  })
  .strict();

export type CreateProduct = z.infer<typeof createProductZod>["body"];
export type UpdateProduct = z.infer<typeof updateProductZod>["body"];
