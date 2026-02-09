import { Router } from "express";
import { userController } from "../../controllers/user.controller";
import { authenticated } from "../../middlewares/authroized";
import { updateProfileZod } from "../../schemas/user.schema";
import { validate } from "../../middlewares/validate";
import { idParamSchema } from "../../schemas/standred.schema";
import { deactivateUserSchema } from "../../schemas/auth.schema";

const router = Router();

router.use(authenticated);
router
  .route("/me")
  .get(userController.getUserHimself)
  .patch(validate(updateProfileZod), userController.updateUserHimself)
  .delete(validate(idParamSchema), userController.deleteHimself);

router.patch(
  "/me/deactivate",
  validate(deactivateUserSchema),
  userController.deactivateAccount,
);

export default {
  path: "/users",
  router,
};
