import { At, Image } from "./global.dto";

export const BRAND_STATUS = ["active", "inactive", "archived"] as const;
export type BrandStatus = (typeof BRAND_STATUS)[number];
export enum BrandStatusEnum {
  ACTIVE = "active",
  INACTIVE = "inactive",
  ARCHIVED = "archived",
}
export type BrandDto = At & {
  name: string;
  image: Image;
  status: BrandStatus;
  slug: string;
  deletedAt?: Date | null;
};
