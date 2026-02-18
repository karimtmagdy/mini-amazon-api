import { z } from "zod/v4";

export const defaultCouponZod = z.object({
  body: z.object({
    name: z
      .string()
      .min(3, {
        message: "Coupon name must be at least 3 characters",
      })
      .max(50, {
        message: "Coupon name must be less than 50 characters",
      })
      .transform((name) => name.trim().toUpperCase()),
    expiry: z.string().transform((str) => new Date(str)),
    discount: z
      .number()
      .min(1, {
        message: "Discount must be at least 1%",
      })
      .max(100, {
        message: "Discount cannot exceed 100%",
      }),
    isActive: z.boolean().optional().default(true),
  }),
});
export const createCouponZod = defaultCouponZod.shape.body.clone();
export const updateCouponZod = defaultCouponZod.shape.body.clone();

export type CreateCoupon = z.infer<typeof createCouponZod>;
export type UpdateCoupon = z.infer<typeof updateCouponZod>;
