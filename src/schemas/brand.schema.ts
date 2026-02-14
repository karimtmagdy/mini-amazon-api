import { z } from "zod";
import { CATEGORY_STATUS } from "../contract/category.dto";

export const brandZod = z
  .object({
    body: z.object({
      name: z
        .string({ message: "Brand name is required" })
        .min(2, { message: "Brand name must be at least 2 characters long" })
        .max(30, {
          message: "Brand name must be at most 30 characters long",
        }),
      status: z.enum(CATEGORY_STATUS).default("active"),
      image: z.object({ url: z.string(), publicId: z.string() }).optional(),
      slug: z.string().readonly(),
    }),
  })
  .strict();

export const createBrandZod = z
  .object({ body: brandZod.shape.body.omit({ slug: true }) })
  .strict();

export const updateBrandZod = z
  .object({
    body: brandZod.shape.body
      .pick({ name: true, status: true })
      .refine((data) => data.status, {
        message: "select a valid status",
      }),
  })
  .strict();

export type CreateBrand = z.infer<typeof createBrandZod>["body"];
export type UpdateBrand = z.infer<typeof updateBrandZod>["body"];
