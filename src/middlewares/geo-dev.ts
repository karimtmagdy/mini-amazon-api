import { Request, Response, NextFunction } from "express";
import { env } from "../lib/env";

/**
 * Middleware to mock Vercel geolocation headers in development mode.
 * This allows the application to behave as if it's running on Vercel
 * while being in local development.
 */
export const geoDev = (req: Request, _res: Response, next: NextFunction) => {
  if (env.nodeEnv === "development") {
    // Only set if not already present (to avoid overwriting if manually set in tests)
    req.headers["x-vercel-ip-city"] =
      req.headers["x-vercel-ip-city"] || "Cairo";
    req.headers["x-vercel-ip-country"] =
      req.headers["x-vercel-ip-country"] || "EG";
    req.headers["x-vercel-ip-country-region"] =
      req.headers["x-vercel-ip-country-region"] || "C";
  }
  next();
};
