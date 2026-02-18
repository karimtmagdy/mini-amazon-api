import { Router } from "express";
import { subCategoryController } from "../../controllers/subcategory.controller";
import { idParamZod, validate } from "../../middlewares/validate";

const router = Router();

router.get("/", subCategoryController.getAll);
router.get("/:id", validate(idParamZod, "params"), subCategoryController.getOne);

export default {
  path: "/subcategories",
  router,
};
