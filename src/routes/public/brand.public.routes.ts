import { Router } from "express";
import { brandController } from "../../controllers/brand.controller";
import { idParamZod, validate } from "../../middlewares/validate";

const router = Router();

router.get("/", brandController.getAll);
router.get("/:id", validate(idParamZod), brandController.getOne);

export default {
  path: "/brands",
  router,
};
