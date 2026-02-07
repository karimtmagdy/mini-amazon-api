import { Router } from "express";
import { authController } from "../../controllers/auth.controller";
import { validate } from "../../middlewares/validate";
import { loginUserSchema } from "../../schemas/auth.schema";

const router = Router();

// router.post("/register", authController.register);
router.post("/login", validate(loginUserSchema), authController.login);

export default {
  path: "/auth",
  router,
};
