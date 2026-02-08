import { Router } from "express";
import { appSettingsController } from "../../controllers/app-settings.controller";
import { validate } from "../../middlewares/validate";
import { updateAppSettingsSchema } from "../../schemas/app-settings.schema";
import { authenticated, checkPermission } from "../../middlewares/authroized";

const router = Router();

// Public route to get settings
router.get("/", appSettingsController.getSettings);

// Admin route to update settings
router.patch(
  "/",
  authenticated,
  checkPermission(["admin"]),
  validate(updateAppSettingsSchema),
  appSettingsController.updateSettings,
);

export default {
  path: "/app-settings",
  router,
};
