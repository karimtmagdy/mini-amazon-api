import { Types } from "mongoose";
import { At, Image } from "./global.dto";

export const PRODUCT_STATUS = [
  "active",
  "inactive",
  "draft",
  "archived",
] as const;
export type ProductStatus = (typeof PRODUCT_STATUS)[number];
export type ProductStockStatus = "in-stock" | "out-of-stock";
export type ProductType = "physical" | "digital";

export type ProductDto = At & {
  name: string;
  price: number;
  PriceAfterDiscount: number;
  description: string;
  slug: string;
  sku: string;
  stock: number;
  cover?: Image;
  sold: number;
  status: ProductStatus;
  tags: string[];
  colors: string[];
  images: Image[];
  discount: number;
  ratingsAverage: number;
  ratingsCount: number;
  category: Types.ObjectId[];
  subcategory: Types.ObjectId[];
  brand: Types.ObjectId;
  deletedAt: Date | null;
};
export type ProductFilterDTO = {
  status?: ProductStatus;
  category?: string;
  brand?: string;
  search?: string;
};
