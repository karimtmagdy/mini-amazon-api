import { z } from "zod";
import { mongoIdRegex } from "./standred.schema";
export const defaultWishListZod = z.object({
  body: z.object({
    productId: z.string().regex(mongoIdRegex, "Invalid product ID"),
  }),
});
export const addToWishlistZod = defaultWishListZod.shape.body.clone();
export const removeFromWishlistZod = defaultWishListZod.shape.body.clone();
