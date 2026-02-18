import { Router } from "express";
import { categoryController } from "../../controllers/category.controller";
import { idParamZod, validate } from "../../middlewares/validate";

const router = Router();

router.get("/", categoryController.getAll);
router.get("/:id", validate(idParamZod, "params"), categoryController.getOne);

export default {
  path: "/subcategories",
  router,
};
