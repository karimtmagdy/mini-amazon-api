import express, { type Request, type Response } from "express";
// import "@config/db";
// import userRouter from "@routes/userRoutes";
import "dotenv/config";
const app = express();

// Built-in JSON body parser
app.use(express.json());

// Simple health route
app.get(["/", "/health"], (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

// User routes
// app.use("/users", userRouter);

export default app;
