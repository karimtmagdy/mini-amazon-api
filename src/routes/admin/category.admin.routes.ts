import { Router } from "express";
import { categoryController } from "../../controllers/category.controller";
import { validate } from "../../middlewares/validate";
import { idParamZod } from "../../schemas/standred.schema";
import {
  createCategoryZod,
  updateCategoryZod,
} from "../../schemas/category.schema";
import { authenticated, checkPermission } from "../../middlewares/authroized";
const router = Router();

router.use(authenticated, checkPermission(["admin", "manager"]));
router.post("/", validate(createCategoryZod), categoryController.create);
router.patch(
  "/:id",
  validate(idParamZod),
  validate(updateCategoryZod),
  categoryController.update,
);
router.delete(
  "/:id",
  checkPermission(["admin"]),
  validate(idParamZod),
  categoryController.softDelete,
);

export default {
  path: "/categories",
  router,
};
