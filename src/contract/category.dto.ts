import { At, Image } from "./global.dto";

export const CATEGORY_STATUS = ["active", "inactive", "archived"] as const;
export type CategoryStatus = (typeof CATEGORY_STATUS)[number];

export type CategoryDto = At & {
  name: string;
  image?: Image;
  slug?: string;
  status: CategoryStatus;
  description: string;
};
