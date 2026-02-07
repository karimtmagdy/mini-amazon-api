import publicRoutes from "./public";
import type { Express, Router } from "express";

type Route = {
  path: string;
  router: Router;
};
const RV1 = "/api/v1";
export const setupRoutes = (app: Express) => {
  publicRoutes.forEach((route: Route) => {
    app.use(RV1 + route.path, route.router);
  });
};
