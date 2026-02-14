import { Router } from "express";
import { categoryController } from "../../controllers/category.controller";
import { idParamZod, validate } from "../../middlewares/validate";
import {
  createCategoryZod,
  updateCategoryZod,
} from "../../schemas/category.schema";
import { authenticated, checkPermission } from "../../middlewares/authroized";
const router = Router();

router.use(authenticated, checkPermission(["admin", "manager"]));
router.post("/", validate(createCategoryZod), categoryController.create);
router
  .route("/:id")
  .patch(
    validate(idParamZod),
    validate(updateCategoryZod),
    categoryController.update,
  )
  .delete(
    checkPermission(["admin"]),
    validate(idParamZod),
    categoryController.softDelete,
  );

export default {
  path: "/categories",
  router,
};
