import type { Route } from "../../contract/global.dto";
import appSettingsRoutes from "./app.admin.routes";
import userRoutes from "./user.admin.routes";
import statsRoutes from "./stats.admin.routes";
import categoryRoutes from "./category.admin.routes";
import subCategoryRoutes from "./subcategory.admin.routes";
import brandRoutes from "./brand.admin.routes";
export default [
  appSettingsRoutes,
  userRoutes,
  statsRoutes,
  categoryRoutes,
  subCategoryRoutes,
  brandRoutes,
] as Route[];
