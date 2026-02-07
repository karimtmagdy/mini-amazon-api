import { Router } from "express";
import { userController } from "../../controllers/user.controller";

const router = Router();

router.route("/me").get(userController.getUserHimself);

export default {
  path: "/users",
  router,
};
