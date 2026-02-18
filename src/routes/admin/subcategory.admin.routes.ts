import { Router } from "express";
import { subCategoryController } from "../../controllers/subcategory.controller";
import { idParamZod, validate } from "../../middlewares/validate";
import {
  createSubCategoryZod,
  updateSubCategoryZod,
} from "../../schema/subcategory.schema";
import { authenticated, checkPermission } from "../../middlewares/authroized";
const router = Router();

router.use(authenticated, checkPermission(["admin", "manager"]));
router.post(
  "/",
  validate(createSubCategoryZod, "body"),
  subCategoryController.create,
);
router
  .route("/:id")
  .patch(
    validate(idParamZod, "params"),
    validate(updateSubCategoryZod, "body"),
    subCategoryController.update,
  )
  .delete(
    checkPermission(["admin"]),
    validate(idParamZod, "params"),
    subCategoryController.delete,
  );

export default {
  path: "/subcategories",
  router,
};
