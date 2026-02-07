import express, { type Request, type Response } from "express";
// import "dotenv/config";
import { setupRoutes } from "./routes";
import { configApp } from "./config/config-app";
const app = express();

// Built-in JSON body parser
// app.use(express.json());

// Simple health route
configApp(app);
setupRoutes(app);
app.get(["/", "/health"], (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});
export default app;
