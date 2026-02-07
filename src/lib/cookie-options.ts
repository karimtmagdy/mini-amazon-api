import { type CookieOptions as ExpressCookieOptions } from "express";
// import { jwtConfig } from "@/config/jwt.config";

export const CookieOptions: ExpressCookieOptions = {
  httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
  secure: true, //jwtConfig.nodeEnv === "production", // Only send cookie over HTTPS in production
  sameSite: "strict", // Prevent CSRF attacks
  maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  path: "/", // Cookie is accessible throughout the application
  // signed: true, // Cookie is signed with a secret key
};
