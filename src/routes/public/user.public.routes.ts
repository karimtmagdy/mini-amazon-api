import { Router } from "express";
import { userController } from "../../controllers/user.controller";

const router = Router();

router.get("/me", userController.getUserHimself);

export default {
  path: "/user",
  router,
};
