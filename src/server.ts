// import "module-alias/register"; // enable @alias imports at runtime
import mongoose from "mongoose";
import "dotenv/config";
import app from "./app";
import { Database } from "./config/data/db";
import { env } from "./lib/env";
import { logger } from "./lib/logger";
// import { injectSpeedInsights } from "@vercel/speed-insights";
const PORT = env.port;

// injectSpeedInsights();
void (async () => {
  try {
    if (env.nodeEnv !== "production") {
      app.listen(PORT, () => {
        logger.log(`Started on port ${PORT}`);
      });
    }
    await Database.getInstance();

    // Start cron jobs for automated cleanup tasks
    // startCronJobs();
  } catch (error) {
    logger.error("🔥 Failed to start server:", error);
  }
})();
process.on("uncaughtException", (error) => {
  logger.log("👋 Uncaught Exception: ", error);
  process.exit(1);
});
process.on("unhandledRejection", (reason) => {
  logger.log("👋 Unhandled Rejection: ", reason);
  process.exit(1);
});
process.on("EADDRINUSE", (error: NodeJS.ErrnoException) => {
  if (error.code === "EADDRINUSE") {
    logger.log("Port is already in use");
    process.exit(1);
  }
});
const gracefulShutdown = async (signal: string) => {
  logger.log(`👋 Received ${signal}. Shutting down gracefully...`);
  try {
    await mongoose.connection.close();
    logger.log("✅ MongoDB connection closed.");
    process.exit(0);
  } catch (err) {
    logger.error("❌ Error during shutdown:", err);
    process.exit(1);
  }
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGUSR2", () => gracefulShutdown("SIGUSR2")); // nodemon restart signal

process.on("exit", (code: number) => {
  if (code === 0) {
    logger.log(`👋 Server is shutting down with code ${code}`);
  }
});
