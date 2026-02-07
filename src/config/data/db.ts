import mongoose from "mongoose";
// import '../../scripts/sync-env-vercel'
export class Database {
  static instance: Database;
  private constructor() {}
  public static async getInstance(): Promise<Database> {
    const { DB_URI, DB_PASS, DB_LOCAL, MONGO_URL_MONGODB_URI } = process.env;
    const url = DB_URI?.replace("<PASSWORD>", String(DB_PASS));
    const uri = url || DB_LOCAL || MONGO_URL_MONGODB_URI;
    if (!uri) {
      throw new Error("Please provide a MongoDB URI");
    }
    await mongoose.connect(uri);
    console.log("☁️ Database connected");
    if (!Database.instance) {
      Database.instance = new Database();
    }

    return Database.instance;
  }
}
