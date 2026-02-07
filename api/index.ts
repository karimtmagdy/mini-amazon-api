import express from "express";
import "dotenv/config";

const app = express();

app.get(["/", "/health"], (_req, res) => {
  res.status(200).json({
    code: 200,
    status: "success",
    api: "Mini Amazon",
    message: "Welcome to the Vercel Backend",
    developer: "karimtmagdy",
    platform: "Vercel",
    version: "v1",
    environment: "production",
  });
});

export default app;
