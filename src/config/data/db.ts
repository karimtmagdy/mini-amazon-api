import mongoose from "mongoose";
// import '../../scripts/sync-env-vercel'
import { env } from "../../lib/env";
import { logger } from "../../lib/logger";
export class Database {
  static instance: Database;
  private constructor() {}
  public static async getInstance(): Promise<Database> {
    const { dbUri, dbPass, dbLocal, mongoDbUri } = env;
    const url = dbUri?.replace("<PASSWORD>", String(dbPass));
    const uri = url || dbLocal || mongoDbUri;
    if (!uri) {
      throw new Error("Please provide a MongoDB URI");
    }
    await mongoose.connect(uri);
    logger.log("🛠  Database connected ☁️");
    if (!Database.instance) {
      Database.instance = new Database();
    }

    return Database.instance;
  }
}
