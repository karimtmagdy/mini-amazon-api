import type { Route } from "../contract/global.dto";
import publicRoutes from "./public";
import type { Express } from "express";

const RV1 = "/api/v1";
export const setupRoutes = (app: Express) => {
  publicRoutes.forEach((route: Route) => {
    app.use(RV1 + route.path, route.router);
  });
};
