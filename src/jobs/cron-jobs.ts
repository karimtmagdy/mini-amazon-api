import cron from "node-cron";
import { brandCleanupService } from "../services/cleanup/cleanup.service";
import { logger } from "../lib/logger";

/**
 * تشغيل كل الـ Cron Jobs
 */
export function startCronJobs() {
  // Cleanup للـ Brands المحذوفة - يشتغل كل يوم الساعة 2 صباحاً
  // Cron Expression: "0 2 * * *" = الدقيقة 0، الساعة 2، كل يوم، كل شهر، كل يوم في الأسبوع
  cron.schedule("0 2 * * *", async () => {
    logger.log("⏰ Running scheduled cleanup for deleted brands...");
    try {
      // استخدام المدة من الـ Environment Variable أو 30 يوم كـ default
      const cleanupDays = parseInt(process.env.CLEANUP_DAYS || "30", 10);
      const deletedCount =
        await brandCleanupService.cleanupOldDeletedBrands(cleanupDays);
      if (deletedCount === 0) {
        logger.log("✅ Cleanup completed: No old deleted brands to remove");
      }
    } catch (error) {
      logger.error("❌ Cleanup job failed:", error);
    }
  });

  logger.log("✅ Cron jobs initialized successfully");
}
