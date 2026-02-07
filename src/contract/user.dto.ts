import type { ObjectId } from "mongoose";
import type { At, Image } from "./global.dto";

export const USER_STATE = ["online", "offline"] as const;
export type UserState = (typeof USER_STATE)[number];
export const USER_GENDERS = ["male", "female"] as const;
export type UserGender = (typeof USER_GENDERS)[number];
export type UserAccountStatus = (typeof USER_ACCOUNT_STATUS)[number];
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
export const USER_ROLES = [
  "admin",
  "user",
  //   "guest",
  //   "editor",
  //   "moderator",
  //   "contributor",
  //   "subscriber",
  //   "owner",
  //   "manager",
  //   "viewer",
] as const;
export type UserRole = (typeof USER_ROLES)[number];

export type UserDto = At & {
  id: string;
  // id: string | ObjectId;
  username: string;
  slug?: string;
  email: string;
  password: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
  name?: {
    first: string;
    last: string;
  };
  age?: number;
  gender?: UserGender;
  image?: Image;
  role: UserRole;
  status: UserAccountStatus;
  state: UserState;
  //   verified?: boolean;
  //   verifiedAt?: Date;
  //   remember?: boolean;
  activeAt?: Date;
  logoutAt?: Date;
  lockedUntil?: Date;
    failedLoginAttempts?: number;
  //   cart?: {
  //     type?: string;
  //     productId: any;
  //   }[];
  //   wishlist?: any[];
};
