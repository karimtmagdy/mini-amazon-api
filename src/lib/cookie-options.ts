import { type CookieOptions as ExpressCookieOptions } from "express";
import { env } from "./env";

export const BaseCookieOptions: ExpressCookieOptions = {
  httpOnly: true,
  secure: env.nodeEnv === "production",
  sameSite: env.nodeEnv === "production" ? "none" : "lax", // 'none' requires 'secure: true'
  path: "/",
};

export const CookieOptions: ExpressCookieOptions = {
  ...BaseCookieOptions,
  maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
};
