import { z } from "zod/v4";
import { BRAND_STATUS } from "../contract/brand.dto";

export const defaultBrandZod = z
  .object({
  body: z.object({
    name: z
      .string({ message: "Brand name is required" })
      .min(2, { message: "Brand name must be at least 2 characters long" })
      .max(30, { message: "Brand name must be at most 30 characters long" }),
    status: z.enum(BRAND_STATUS).default("active"),
    image: z.object({ url: z.string(), publicId: z.string() }).optional(),
  }),
});

export const createBrandZod = defaultBrandZod.shape.body.pick({
  name: true,
  status: true,
  image: true,
});

export const updateBrandZod = defaultBrandZod.shape.body
  .pick({ name: true, status: true, image: true })
  .partial();

export type CreateBrand = z.infer<typeof createBrandZod>;
export type UpdateBrand = z.infer<typeof updateBrandZod>;
