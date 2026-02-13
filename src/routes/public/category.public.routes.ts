import { Router } from "express";
import { categoryController } from "../../controllers/category.controller";
import { validate } from "../../middlewares/validate";
import { idParamZod } from "../../schemas/standred.schema";

const router = Router();

router.get("/", categoryController.getAll);
router.get("/:id", validate(idParamZod), categoryController.getOne);

export default {
  path: "/categories",
  router,
};
