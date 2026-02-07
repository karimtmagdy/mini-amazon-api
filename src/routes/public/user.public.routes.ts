import { Router } from "express";
import { userController } from "../../controllers/user.controller";
import { authenticated } from "../../middlewares/authroized";

const router = Router();

router.use(authenticated);
router.route("/me").get(userController.getUserHimself);

export default {
  path: "/users",
  router,
};
