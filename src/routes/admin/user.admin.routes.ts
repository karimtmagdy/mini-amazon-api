import { Router } from "express";
import { userController } from "../../controllers/user.controller";
import { authenticated, checkPermission } from "../../middlewares/authroized";
import { validate } from "../../middlewares/validate";
import { changeRoleZod, createUserZod } from "../../schemas/user.schema";
import {
  idParamSchema,
  multipleBulkDeleteSchema,
} from "../../schemas/standred.schema";

const router = Router();
router.use(authenticated, checkPermission(["admin"]));
router
  .route("/")
  .get(userController.getAllUsers)
  .post(validate(createUserZod), userController.createUser);

router
  .route("/:id")
  .get(validate(idParamSchema), userController.getOneUser)
  .delete(
    validate(idParamSchema),
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
  validate(idParamSchema),
  userController.updateStatusByAdmin,
);
router.patch(
  "/deactivate/:id",
  checkPermission(["admin"]),
  validate(idParamSchema),
  userController.deactivateByAdmin,
);
router.patch(
  "/unlock/:id",
  checkPermission(["admin"]),
  validate(idParamSchema),
  userController.unlockByAdmin,
);
router.delete(
  "/bulk",
  checkPermission(["admin"]),
  validate(multipleBulkDeleteSchema),
  userController.deleteBulk,
);
export default {
  path: "/users",
  router,
};
