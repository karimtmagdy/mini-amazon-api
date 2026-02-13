import { Types } from "mongoose";
import { At } from "./global.dto";
export const WISHLIST_STATUS = ["active", "inactive", "completed"] as const;
export type WishlistStatus = (typeof WISHLIST_STATUS)[number];
export type WishlistDto = At & {
  user: Types.ObjectId;
  products: Types.ObjectId[];
};
