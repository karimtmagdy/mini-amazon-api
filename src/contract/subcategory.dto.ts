import { Types } from "mongoose";
import { At } from "./global.dto";

export const SUBCATEGORY_STATUS = ["active", "inactive", "archived"] as const;
export type SubCategoryStatus = (typeof SUBCATEGORY_STATUS)[number];
export enum SubCategoryStatusEnum {
  ACTIVE = "active",
  INACTIVE = "inactive",
  ARCHIVED = "archived",
}

export type SubCategoryDto = At & {
  name: string;
  slug: string;
  description?: string;
  category: (Types.ObjectId | string)[];
  products: number;
  status: SubCategoryStatus;
};
