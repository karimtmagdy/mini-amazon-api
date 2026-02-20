import { At, Image } from "./global.dto";

export const CATEGORY_STATUS = ["active", "inactive", "archived"] as const;
export type CategoryStatus = (typeof CATEGORY_STATUS)[number];
export enum CategoryStatusEnum {
  ACTIVE = "active",
  INACTIVE = "inactive",
  ARCHIVED = "archived",
}
export type CategoryDto = At & {
  name: string;
  description: string;
  image: Image;
  slug: string;
  status: CategoryStatus;
  products: number;
  deletedAt: Date | null;
};
