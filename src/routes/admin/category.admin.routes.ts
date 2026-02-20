import { Router } from "express";
import { categoryController } from "../../controllers/category.controller";
import { idZod, validate } from "../../middlewares/validate";
import {
  createCategoryZod,
  updateCategoryZod,
} from "../../schema/category.schema";
import { authenticated, checkPermission } from "../../middlewares/authroized";
const router = Router();

router.use(authenticated, checkPermission(["admin", "manager"]));
router.get("/stats", categoryController.getStats);
router.post(
  "/",
  validate(createCategoryZod, "body"),
  categoryController.create,
);
router
  .route("/:id")
  .patch(
    validate(idZod, "params"),
    validate(updateCategoryZod, "body"),
    categoryController.update,
  )
  .delete(
    checkPermission(["admin"]),
    validate(idZod, "params"),
    categoryController.softDelete,
  );


export default {
  path: "/categories",
  router,
};
