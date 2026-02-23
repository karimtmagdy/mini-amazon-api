import type { At, Image } from "./global.dto";

export const USER_STATE = ["online", "offline"] as const;
export enum UserStateEnum {
  ONLINE = "online",
  OFFLINE = "offline",
}
export type UserState = (typeof USER_STATE)[number];
export const USER_GENDERS = ["male", "female"] as const;
export enum UserGenderEnum {
  MALE = "male",
  FEMALE = "female",
}
export type UserGender = (typeof USER_GENDERS)[number];
export const USER_ACCOUNT_STATUS = [
  "active",
  "inactive",
  "suspended",
  "banned",
  "pending",
  "verified",
  "archived",
  "deactivated",
  "locked",
] as const;
export enum UserAccountStatusEnum {
  ACTIVE = "active",
  INACTIVE = "inactive",
  SUSPENDED = "suspended",
  ARCHIVED = "archived",
  DEACTIVATED = "deactivated",
  LOCKED = "locked",
  BANNED = "banned",
  PENDING = "pending",
  VERIFIED = "verified",
}
export type UserAccountStatus = (typeof USER_ACCOUNT_STATUS)[number];

export const USER_ROLES = [
  "super-admin",
  "admin",
  "manager",
  "viewer",
  "user",
  "seller",
  "delivery-boy",
  "staff",
  "customer-support",
  "vendor",
] as const;
export type UserRole = (typeof USER_ROLES)[number];
export enum UserRoleEnum {
  ADMIN = "admin",
  USER = "user",
  MANAGER = "manager",
  VIEWER = "viewer",
  SELLER = "seller",
  DELIVERY_BOY = "delivery-boy",
  SUPER_ADMIN = "super-admin",
  STAFF = "staff",
  CUSTOMER_SUPPORT = "customer-support",
  VENDOR = "vendor",
}
export type UserDto = At & {
  id: string;
  username: string;
  slug: string;
  email: string;
  password: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
  name: {
    first: string;
    last: string;
  };
  age: number;
  gender: UserGender;
  image: Image;
  role: UserRole;
  status: UserAccountStatus;
  state: UserState;
  activeAt: Date;
  logoutAt: Date;
  lockedUntil: Date;
  failedLoginAttempts: number;
  passwordChangedAt?: Date;
  verifiedAt?: Date;
  verifyOtp?: {
    code: string;
    expiresAt: Date;
  } | null;
  resetOtp?: {
    code: string;
    expiresAt: Date;
  } | null;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  //   cart?: {
  //     type?: string;
  //     productId: string;
  //   }[];
  //   wishlist?: any[];
};
// orders: [{ type: Types.ObjectId, ref: "order", sparse: true }],
// wishlist: [{ type: Types.ObjectId, ref: "wishlist" }],
// likes: [{ type: Types.ObjectId, ref: "likes" }],
// favorite: [{ type: Types.ObjectId, ref: "favorite" }],
