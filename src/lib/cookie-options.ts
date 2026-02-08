import { type CookieOptions as ExpressCookieOptions } from "express";
import { env } from "./env";

export const CookieOptions: ExpressCookieOptions = {
  httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
  secure: true, //env.nodeEnv === "production", // Only send cookie over HTTPS in production
  sameSite: "none", // Lax in dev, None in prod for cross-domain
  // sameSite: env.nodeEnv === "production" ? "none" : "lax", // Lax in dev, None in prod for cross-domain
  maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  path: "/", // Cookie is accessible throughout the application
};
