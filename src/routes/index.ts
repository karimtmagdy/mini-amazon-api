import publicRoutes from "./public";
import type { Express, Router } from "express";

type Route = {
  path: string;
  router: Router;
};

export const setupRoutes = (app: Express) => {
  publicRoutes.forEach((route: Route) => {
    app.use(route.path, route.router);
  });
};
