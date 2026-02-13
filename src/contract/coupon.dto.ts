import { At } from "./global.dto";

export type CouponDto = At & {
  name: string;
  expiry: Date;
  discount: number;
  isActive: boolean;
  deletedAt: Date | null;
};
