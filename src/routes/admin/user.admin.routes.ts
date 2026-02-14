import { Router } from "express";
import { userController } from "../../controllers/user.controller";
import { authenticated, checkPermission } from "../../middlewares/authroized";
import { idParamZod, validate } from "../../middlewares/validate";
import { changeRoleZod, createUserZod } from "../../schemas/user.schema";
import { multipleBulkDeleteZod } from "../../schemas/standred.schema";

const router = Router();
router.use(authenticated, checkPermission(["admin"]));
router
  .route("/")
  .get(userController.getAll)
  .post(validate(createUserZod), userController.create);

router
  .route("/:id")
  .get(validate(idParamZod), userController.getOne)
  .delete(
    validate(idParamZod),
    checkPermission(["admin"]),
    userController.deleteSoftByAdmin,
  );

router.patch(
  "/role/:id",
  validate(changeRoleZod),
  checkPermission(["admin"]),
  userController.changeRoleByAdmin,
);
router.patch(
  "/status/:id",
  checkPermission(["admin"]),
  validate(idParamZod),
  userController.updateStatusByAdmin,
);
router.patch(
  "/deactivate/:id",
  checkPermission(["admin"]),
  validate(idParamZod),
  userController.deactivateByAdmin,
);
router.patch(
  "/unlock/:id",
  checkPermission(["admin"]),
  validate(idParamZod),
  userController.unlockByAdmin,
);
router.delete(
  "/bulk",
  checkPermission(["admin"]),
  validate(multipleBulkDeleteZod),
  userController.deleteBulk,
);
export default {
  path: "/users",
  router,
};
