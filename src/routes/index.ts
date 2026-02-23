import type { Route } from "../contract/global.dto";
import publicRoutes from "./public";
import adminRoutes from "./admin";
import type { Express } from "express";

// Prefixed Routes
const RV1 = "/api/v1";
export const setupRoutes = (app: Express) => {
  publicRoutes.forEach((route: Route) => {
    app.use(RV1 + route.path, route.router);
  });
  adminRoutes.forEach((route: Route) => {
    app.use(RV1 + "/admin" + route.path, route.router);
  });
};
  // Cron Jobs
  // app.use("/api", CronProjectRoutes);