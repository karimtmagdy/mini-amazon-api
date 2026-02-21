import express from "express";
import "dotenv/config";
import { Database } from "./config/data/db";
import { setupRoutes } from "./routes";
import { configApp } from "./config/config-app";
import { MiddlewareApplication } from "./middlewares/error.middlewares";

const app = express();
configApp(app);

/**
 * ✅ Serverless-safe DB middleware.
 * Runs before every request to ensure the MongoDB connection
 * exists (or reuses the cached one). This avoids the race
 * condition where initDb() fires but hasn't finished by the
 * time the first request arrives on a cold start.
 */
app.use(async (_req, _res, next) => {
  try {
    await Database.getInstance();
    next();
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    next(error);
  }
});

setupRoutes(app);
app.get(["/", "/health"], (_req, res) => {
  res.status(200).json({
    code: 200,
    status: "success",
    api: "Mini Amazon",
    message: "Welcome to the Vercel Backend",
    developer: "karimtmagdy",
    platform: "Vercel",
    version: "v1",
    environment: "production",
  });
});
MiddlewareApplication(app);

export default app;
