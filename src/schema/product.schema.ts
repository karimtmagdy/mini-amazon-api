import { z } from "zod/v4";
import { PRODUCT_STATUS } from "../contract/product.dto";
import { mongoIdRegex } from "./standred.schema";

export const defaultProductZod = z
  .object({
    body: z.object({
      name: z
        .string({ message: "Product name is required" })
        .min(3, { message: "Product name must be at least 3 characters long" })
        .max(100, {
          message: "Product name must be at most 100 characters long",
        }),
      // description: z
      //   .string({ message: "Product description is required" })
      //   .min(10, {
      //     message: "Product description must be at least 10 characters long",
      //   })
      //   .max(1000, {
      //     message: "Product description must be at most 1000 characters long",
      //   }),
      // price: z
      //   .number({ message: "Price is required" })
      //   .min(0, { message: "Price must be at least 0" })
      //   .positive("the price must be greater than zero")
      //   .max(1000000, { message: "Price must be at most 1,000,000" }),
      stock: z
        .number({ message: "Stock is required" })
        .int()
        .min(0, { message: "Stock must be at least 0" })
        .nonnegative({ message: "the quantity must be zero or greater." })
        .default(0),

      status: z.enum(PRODUCT_STATUS).default("active"),
      category: z
        .array(z.string().regex(mongoIdRegex, "Invalid category ID"))
        .min(1, { message: "Product must belong to at least one category" }),
      subcategory: z
        .array(z.string().regex(mongoIdRegex, "Invalid subcategory ID"))
        .optional(),
      brand: z.string().regex(mongoIdRegex, "Invalid brand ID").optional(),
      // discount: z
      //   .number()
      //   .nonnegative()
      //   .min(0, { message: "discount cannot be negative" })
      //   .max(100, { message: "discount cannot be greater than 100" })
      //   .default(0),
      // colors: z.array(z.string()).optional(),
      sold: z.number().nonnegative().default(0),
      // tags: z
      //   .array(z.string())
      //   .max(10, { message: "the number of tags must not exceed 10." })
      //   .optional(),
      cover: z.object({ url: z.string(), publicId: z.string() }).optional(),
      // images: z
      //   .array(z.object({ url: z.string(), publicId: z.string() }))
      //   .max(5, { message: "maximum 5 images" })
      //   .optional(),
      // sku: z.string().optional(),
      // ratingsAverage: z.number(),
      // ratingsCount: z.number(),
    }),
  })
  .strict();
// "message": "Invalid input: expected nonoptional, received undefined"
export const createProductZod = defaultProductZod.shape.body.clone().strict();
// .required();
export const updateProductZod = defaultProductZod.shape.body.partial().strict();
export const updateStockZod = defaultProductZod.shape.body
  .pick({
    stock: true,
  })
  .required();

export type CreateProduct = z.infer<typeof createProductZod>;
export type UpdateProduct = z.infer<typeof updateProductZod>;
export type UpdateStock = z.infer<typeof updateStockZod>;
export const getProductsSchema = z.object({
  query: z.object({
    page: z.string().optional().default("1"),
    limit: z.string().optional().default("10"),
    category: z.string().optional(),
    brand: z.string().optional(),
    minPrice: z.string().optional(),
    maxPrice: z.string().optional(),
    search: z.string().optional(),
    sortBy: z
      .enum(["name", "price", "createdAt", "stock", "ratings_average"])
      .optional()
      .default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
  }),
});

export type GetProductsQuery = z.infer<typeof getProductsSchema>["query"];
