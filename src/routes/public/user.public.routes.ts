import { Router } from "express";
import { profileController } from "../../controllers/profile.controller";
import { authenticated } from "../../middlewares/authroized";
import { updateProfileZod } from "../../schemas/user.schema";
import { idParamZod, validate } from "../../middlewares/validate";
import { deactivateUserSchema } from "../../schemas/auth.schema";

const router = Router();

router.use(authenticated);
router
  .route("/me")
  .get(profileController.getUserHimself)
  .patch(validate(updateProfileZod), profileController.updateUserHimself)
  .delete(validate(idParamZod), profileController.deleteHimself);

router.patch(
  "/me/deactivate",
  validate(deactivateUserSchema),
  profileController.deactivateAccount,
);
router.delete("/me/image", validate(idParamZod), profileController.deleteImage);

export default {
  path: "/users",
  router,
};
