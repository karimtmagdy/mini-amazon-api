import mongoose from "mongoose";
import { env } from "../../lib/env";
import { logger } from "../../lib/logger";

/**
 * Global cache to reuse the MongoDB connection across
 * Vercel Serverless Function invocations (cold starts).
 *
 * Without this, every serverless invocation opens a NEW
 * connection and Mongoose buffers queries until it connects,
 * easily hitting the 10-second timeout on slow Atlas tiers.
 */
declare global {
  // eslint-disable-next-line no-var
  var __mongoose_cache: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

// Initialize the global cache once
if (!global.__mongoose_cache) {
  global.__mongoose_cache = { conn: null, promise: null };
}

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

    const cache = global.__mongoose_cache;

    // ✅ Reuse existing connection if already established
    if (cache.conn) {
      logger.log("♻️  Reusing existing MongoDB connection");
      if (!Database.instance) Database.instance = new Database();
      return Database.instance;
    }

    // ✅ Reuse in-progress connection promise (avoids race conditions)
    if (!cache.promise) {
      cache.promise = mongoose.connect(uri, {
        // Recommended settings for Serverless environments
        bufferCommands: false,       // Fail fast instead of buffering
        serverSelectionTimeoutMS: 10000, // 10s to find a server
        socketTimeoutMS: 45000,          // 45s idle socket timeout
        connectTimeoutMS: 10000,         // 10s to establish connection
        maxPoolSize: 10,                 // Limit connection pool for serverless
      });
    }

    try {
      cache.conn = await cache.promise;
      logger.log("🛠  Database connected ☁️");
    } catch (err) {
      // Reset promise so next request retries
      cache.promise = null;
      throw err;
    }

    if (!Database.instance) {
      Database.instance = new Database();
    }

    return Database.instance;
  }
}
