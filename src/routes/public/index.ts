import authRoutes from "./auth.public.routes";
import userRoutes from "./user.public.routes";
import categoryRoutes from "./category.public.routes";
import type { Route } from "../../contract/global.dto";

export default [authRoutes, userRoutes, categoryRoutes] as Route[];
