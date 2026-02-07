import express, { type Request, type Response } from "express";
// import "@config/db";
// import userRouter from "@routes/userRoutes";
import "dotenv/config";
import { setupRoutes } from "./routes";
const app = express();


// Built-in JSON body parser
app.use(express.json());

// Simple health route
app.get(["/", "/health"], (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

// User routes
setupRoutes(app);

export default app;
