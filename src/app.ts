import express, { type Request, type Response } from "express";
// import "dotenv/config";
import { setupRoutes } from "./routes";
import { configApp } from "./config/config-app";
const app = express();

app.use(express.json());

configApp(app);
setupRoutes(app);
app.get(["/", "/health"], (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});
export default app;
