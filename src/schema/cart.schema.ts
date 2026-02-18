import { z } from "zod";
import { mongoIdRegex } from "./standred.schema";

export const addToCartSchema = z.object({
  body: z.object({
    productId: z.string().regex(mongoIdRegex, "Invalid product ID"),
    color: z.string().optional(),
    quantity: z.number().int().positive().optional().default(1),
  }),
});

export const updateCartItemSchema = z.object({
  body: z.object({
    quantity: z.number().int().positive(),
  }),
  params: z.object({
    itemId: z.string().regex(mongoIdRegex, "Invalid item ID"),
  }),
});

export const applyCouponSchema = z.object({
  body: z.object({
    coupon: z.string().min(1, "Coupon name is required"),
  }),
});
