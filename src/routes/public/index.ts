import type { Route } from "../../contract/global.dto";
import authRoutes from "./auth.public.routes";
import userRoutes from "./user.public.routes";
import categoryRoutes from "./category.public.routes";
import subCategoryRoutes from "./subcategory.public.routes";
import brandRoutes from "./brand.public.routes";
import productRoutes from "./product.public.routes";
export default [
  authRoutes,
  userRoutes,
  categoryRoutes,
  subCategoryRoutes,
  brandRoutes,
  productRoutes,
] as Route[];
