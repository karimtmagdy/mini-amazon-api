/**
 * Test script للـ Brand Cleanup Service
 *
 * الاستخدام:
 * npm run test:cleanup
 */

import "dotenv/config";
import { Database } from "../config/data/db";
import { brandCleanupService } from "../services/cleanup/cleanup.service";
import { logger } from "../lib/logger";
import { connection } from "mongoose";

async function testCleanup() {
  try {
    // الاتصال بالداتابيز
    await Database;
    logger.log("✅ Connected to database");

    // عرض عدد الـ brands المحذوفة القديمة
    const oldDeletedCount = await brandCleanupService.countOldDeletedBrands(30);
    logger.log(
      `📊 Found ${oldDeletedCount} brand(s) deleted more than 30 days ago`,
    );

    if (oldDeletedCount > 0) {
      // تشغيل الـ cleanup
      logger.log("🗑️  Starting cleanup...");
      const deletedCount =
        await brandCleanupService.cleanupOldDeletedBrands(30);
      logger.log(`✅ Cleanup completed: ${deletedCount} brand(s) deleted`);
    } else {
      logger.log("✅ No old deleted brands to clean up");
    }

    // إغلاق الاتصال
    await connection.close();
    logger.log("👋 Database connection closed");
    process.exit(0);
  } catch (error) {
    logger.error("❌ Test failed:", error);
    process.exit(1);
  }
}

testCleanup();
