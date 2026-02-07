import authRoutes from "./auth.routes";
import type { Router } from "express";

type Route = {
  path: string;
  router: Router;
};

export default [authRoutes] as Route[];
