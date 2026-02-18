import "dotenv/config";
import { connect, disconnect } from "mongoose";
import { Brand } from "../models/brand.model"; // Adjust path as needed based on where I put the file
import { env } from "../lib/env";
const cleanFields = async () => {
  try {
    const url: string = String(env.dbUri).replace(
      "<PASSWORD>",
      String(env.dbPass),
    );
    if (!url) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }
    console.log("Connecting to database...");
    await connect(url);
    console.log("Connected to database.");
    const field = "description";
    console.log(
      `Removing ${field} field from all Brand documents (Bypassing Mongoose)...`,
    );
    // Use native driver to bypass Mongoose Strict Mode
    const result = await Brand.collection.updateMany(
      { [field]: { $exists: true } },
      { $unset: { [field]: "" } }, // MongoDB native expects "" or 1, but technically any value works for $unset
    );
    console.log(
      `Cleanup complete. matched: ${result.matchedCount}, modified: ${result.modifiedCount}`,
    );
    // Verify using native driver as well
    const remaining = await Brand.collection.countDocuments({
      [field]: { $exists: true },
    });
    if (remaining === 0) {
      console.log(
        `✅ VERIFICATION SUCCESS: No documents have ${field} field anymore.`,
      );
    } else {
      console.log(
        `⚠️ VERIFICATION WARNING: ${remaining} documents still have ${field} field.`,
      );
    }
  } catch (error) {
    console.error("Error during cleanup:", error);
  } finally {
    await disconnect();
    console.log("Disconnected from database.");
    process.exit();
  }
};

cleanFields();
