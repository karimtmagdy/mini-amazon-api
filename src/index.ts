import express from "express";
import "dotenv/config";
import { Database } from "./config/data/db";

import { setupRoutes } from "./routes";

const app = express();

// Initialize Database with error handling
const initDb = async () => {
  try {
    await Database.getInstance();
    console.log("✅ Database initialized successfully");
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
  }
};

initDb();

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
setupRoutes(app);

export default app;
