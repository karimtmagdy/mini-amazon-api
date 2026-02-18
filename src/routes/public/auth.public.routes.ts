import { Router } from "express";
import { authController } from "../../controllers/auth.controller";
import { validate } from "../../middlewares/validate";
import { refreshTokenSchema } from "../../schema/auth.schema";
import { authenticated } from "../../middlewares/authroized";
import { loginUserZod } from "../../schema/user.schema";

const router = Router();

// router.post("/register", authController.register);
router.post("/login", validate(loginUserZod,'body'), authController.login);
router.post("/logout", authenticated, authController.logout);
router.post(
  "/logout-devices",
  authenticated,
  authController.logoutOtherDevices,
);
router.post(
  "/refresh-token",
  validate(refreshTokenSchema,),
  authController.refresh,
);
export default {
  path: "/auth",
  router,
};
