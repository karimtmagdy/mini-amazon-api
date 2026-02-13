import appSettingsRoutes from "./app-settings.admin.routes";
import userRoutes from "./user.admin.routes";
import statsRoutes from "./stats.admin.routes";
import type { Route } from "../../contract/global.dto";

export default [appSettingsRoutes, userRoutes, statsRoutes] as Route[];
