import { Router } from "express";
import { subCategoryController } from "../../controllers/subcategory.controller";
import { idZod, validate } from "../../middlewares/validate";
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
    validate(idZod, "params"),
    validate(updateSubCategoryZod, "body"),
    subCategoryController.update,
  )
  .delete(
    checkPermission(["admin"]),
    validate(idZod, "params"),
    subCategoryController.delete,
  );


export default {
  path: "/subcategories",
  router,
};
