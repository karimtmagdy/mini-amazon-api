import express, { Express } from "express";
// import * as sanitizeHtml from "sanitize-html";

import { corsOption } from "./cors-option";
import cookieParser from "cookie-parser";
import { env } from "../lib/env";
import compression from "compression";
import hpp from "hpp";
import morgan from "morgan";
import helmet from "helmet";

export function configApp(app: Express) {
  app.set("trust proxy", 1);
  // 1. Security Headers (Helmet) - Should be first
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
    }),
  );
  // 2. CORS
  app.use(corsOption());
  // 3. Cookie Parser
  app.use(cookieParser(env.accessToken));
  // 4. Compression
  app.use(compression());
  // app.use(express.json());

  // 3. Body Parsing & Validation
  app.use(express.json({ limit: "10kb" }));
  app.use(express.urlencoded({ extended: false, limit: "10kb" }));
  // 4. Sanitization (Works on parsed objects)
  // app.use(sanitizeHtml.defaults()) Prevent NoSQL injection
  app.use(hpp()); // Prevent HTTP Parameter Pollution

  // 5. Logging & Dev Tools (Development only)
  if (env.nodeEnv === "development") {
    const { geoDev } = require("../middlewares/geo-dev");
    app.use(geoDev);
    app.use(morgan("dev"));
  }
  // 6. Rate Limiting
  // app.use(
  //   rateLimit({
  //     windowMs: 15 * 60 * 1000, // 15 minutes
  //     max: 100, // limit each IP to 100 requests per windowMs
  //   }),
  // );
  // Favicon handler
  app.get(["/favicon.ico", "/favicon.png"], (_, res) => {
    res.status(204).end();
  });
}
