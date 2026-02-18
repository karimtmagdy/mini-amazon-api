import { Request, Response } from "express";
import { brandCleanupService } from "../services/cleanup/cleanup.service";
import { logger } from "../lib/logger";
import { catchError } from "../lib/catch.error";

export class CronController {
  runCleanup = catchError(async (req: Request, res: Response) => {
    try {
      logger.log("⏰ Running scheduled cleanup for deleted brands...");

      // Get cleanup days from env or default to 30
      const cleanupDays = parseInt(process.env.CLEANUP_DAYS || "30", 10);

      const deletedCount =
        await brandCleanupService.cleanupOldDeletedBrands(cleanupDays);

      logger.log(
        `✅ Cleanup completed: ${deletedCount} brands permanently deleted.`,
      );

      res.status(200).json({
        success: true,
        message: "Cleanup job executed successfully",
        data: {
          deletedCount,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      logger.error("❌ Cleanup job failed:", error);
      res.status(500).json({
        success: false,
        message: "Cleanup job failed",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });
}

export const cronController = new CronController();
