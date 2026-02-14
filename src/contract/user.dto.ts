import type { At, Image } from "./global.dto";

export const USER_STATE = ["online", "offline"] as const;
export type UserState = (typeof USER_STATE)[number];
export const USER_GENDERS = ["male", "female"] as const;
export type UserGender = (typeof USER_GENDERS)[number];
export const USER_ACCOUNT_STATUS = [
  "active",
  "inactive",
  "banned",
  "pending",
  "verified",
  "archived",
  "deactivated",
  "locked",
] as const;
export type UserAccountStatus = (typeof USER_ACCOUNT_STATUS)[number];
export const USER_ROLES = [
  "admin",
  "user",
  "manager",
  "viewer",
  "seller",
  "delivery-boy",
  "super-admin",
  "staff",
  "customer-support",
  "vendor",
] as const;
export type UserRole = (typeof USER_ROLES)[number];

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
  //   verified?: boolean;
  //   verifiedAt?: Date;
  //   remember?: boolean;
  activeAt: Date;
  logoutAt: Date;
  lockedUntil: Date;
  failedLoginAttempts: number;
  //   cart?: {
  //     type?: string;
  //     productId: string;
  //   }[];
  //   wishlist?: any[];

  // resetPasswordToken: string;
  // resetPasswordExpireAt: Date;
};
// orders: [{ type: Types.ObjectId, ref: "order", sparse: true }],
// forgotPassword: String,
// forgotPasswordExpiry: Date,
// confirmPassword: string;
// verificationToken: String,
// verificationTokenExpireAt: Date,
// verifyOtp: { type: String, default: "" },
// verifyOtpExpireAt: { type: Number, default: 0 },
// resetOtp: { type: String, default: "" },
// resetOtpExpireAt: { type: Number, default: 0 },
// wishlist: [{ type: Types.ObjectId, ref: "wishlist" }],
// likes: [{ type: Types.ObjectId, ref: "likes" }],
// favorite: [{ type: Types.ObjectId, ref: "favorite" }],

// passwordChangedAt: Date;
// passwordResetToken: string;
// passwordResetExpires: Date;
// emailVerifiedAt: Date;
// emailVerificationToken: string;
// emailVerificationExpires: Date;
// emailConfirmationSentAt: Date;
// emailConfirmationToken: string;
// emailConfirmed: boolean;
