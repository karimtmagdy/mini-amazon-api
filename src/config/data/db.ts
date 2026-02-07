import mongoose from "mongoose";

export class Database {
  static instance: Database;
  private constructor() {}
  public static async getInstance(): Promise<Database> {
    const url = process.env.DB_URI?.replace(
      "<PASSWORD>",
      String(process.env.DB_PASS),
    );
    const uri = url || process.env.DB_LOCAL;
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
