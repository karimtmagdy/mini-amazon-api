import type { Route } from "../../contract/global.dto";
import appSettingsRoutes from "./app-settings.admin.routes";
import userRoutes from "./user.admin.routes";
import statsRoutes from "./stats.admin.routes";
import categoryRoutes from "./category.admin.routes";
import brandRoutes from "./brand.admin.routes";

export default [
  appSettingsRoutes,
  userRoutes,
  statsRoutes,
  categoryRoutes,
  brandRoutes,
] as Route[];
