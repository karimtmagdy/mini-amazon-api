import { Router } from "express";
import { appSettingsController } from "../../controllers/app.controller";
import { validate } from "../../middlewares/validate";
import { updateAppSettingsSchema } from "../../schema/app-settings.schema";
import { authenticated, checkPermission } from "../../middlewares/authroized";

const router = Router();
router.use(authenticated);
router
  .route("/")
  .get(appSettingsController.getSettings)
  .patch(
    checkPermission(["admin"]),
    validate(updateAppSettingsSchema),
    appSettingsController.updateSettings,
  );

export default {
  path: "/app-settings",
  router,
};
