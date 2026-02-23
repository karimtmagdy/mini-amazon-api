import { Router } from "express";
import { authController } from "../../controllers/auth.controller";
import { validate } from "../../middlewares/validate";
import { refreshTokenSchema } from "../../schema/auth.schema";
import { authenticated } from "../../middlewares/authroized";
import {
  forgotPasswordZod,
  loginUserZod,
  registerUserZod,
  resetPasswordZod,
  verify2FAZod,
  loginWith2FAZod,
} from "../../schema/user.schema";
import { changePasswordSchema } from "../../schema/auth.schema";

const router = Router();

// --- Authentication Basics ---
router.post("/register", validate(registerUserZod, "body"), authController.register);
router.post("/login", validate(loginUserZod, "body"), authController.login);
router.post("/logout", authenticated, authController.logout);

// --- Session Management ---
router.post("/session/refresh", validate(refreshTokenSchema), authController.refresh);
router.post("/session/logout-others", authenticated, authController.logoutOtherDevices);

// --- Email Verification ---
router.get("/verify-email/:token", authController.verifyEmail);

// --- Password Management ---
router.post("/forgot-password", validate(forgotPasswordZod, "body"), authController.forgotPassword);
router.post("/reset-password", validate(resetPasswordZod, "body"), authController.resetPassword);
router.post("/reset-password/:token", validate(resetPasswordZod, "body"), authController.resetPassword);
router.post("/change-password",authenticated,validate(changePasswordSchema, "body"),authController.changePassword,
);

// --- Two-Factor Authentication (2FA) ---
router.post("/2fa/setup", authenticated, authController.setup2FA);
router.post("/2fa/enable", authenticated, validate(verify2FAZod, "body"), authController.enable2FA);
router.post("/2fa/disable", authenticated, validate(verify2FAZod, "body"), authController.disable2FA);
router.post("/2fa/verify", validate(loginWith2FAZod, "body"), authController.verify2FALogin);
export default {
  path: "/auth",
  router,
};
