import { Router } from "express";
import { brandController } from "../../controllers/brand.controller";
import { idParamZod, validate } from "../../middlewares/validate";
import { createBrandZod, updateBrandZod } from "../../schemas/brand.schema";
import { authenticated, checkPermission } from "../../middlewares/authroized";
const router = Router();

router.use(authenticated, checkPermission(["admin", "manager"]));
router.post("/", validate(createBrandZod), brandController.create);
router.patch(
  "/:id",
  validate(idParamZod),
  validate(updateBrandZod),
  brandController.update,
);
router.delete(
  "/:id",
  checkPermission(["admin"]),
  validate(idParamZod),
  brandController.softDelete,
);

export default {
  path: "/brands",
  router,
};
