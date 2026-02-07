import { Router } from "express";
import { authController } from "../../controllers/auth.controller";
import { validate } from "../../middlewares/validate";
import { loginUserSchema } from "../../schemas/auth.schema";
import { authenticated } from "../../middlewares/authroized";

const router = Router();

// router.post("/register", authController.register);
router.post("/login", validate(loginUserSchema), authController.login);
router.post("/logout", authenticated, authController.logout);
router.post(
  "/logout-devices",
  authenticated,
  authController.logoutOtherDevices,
);
router.post("/refresh-token", authController.refresh);
export default {
  path: "/auth",
  router,
};
