import { Router } from "express";
import { brandController } from "../../controllers/brand.controller";
import { idParamZod, validate } from "../../middlewares/validate";
import { createBrandZod, updateBrandZod } from "../../schema/brand.schema";
import { authenticated, checkPermission } from "../../middlewares/authroized";
import { upload } from "../../config/multer.config";
const router = Router();

router.use(authenticated, checkPermission(["admin", "manager"]));
router.post(
  "/",
  upload.single("image"),
  validate(createBrandZod, "body"),
  brandController.create,
);
router
  .route("/:id")
  .patch(
    upload.single("image"),
    validate(idParamZod),
    validate(updateBrandZod, "body"),
    brandController.update,
  )
  .delete(
    checkPermission(["admin"]),
    validate(idParamZod),
    brandController.softDelete,
  );

export default {
  path: "/brands",
  router,
};
