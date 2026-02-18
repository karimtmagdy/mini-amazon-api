import { Router } from "express";
import { productController } from "../../controllers/product.controller";
import { validate } from "../../middlewares/validate";
// import { idParamSchema } from "../../schema/standred.schema";

const router = Router();

router.get("/", productController.getAll);
// router.get(
//   "/active",
//   productController.getActiveProducts.bind(productController),
// );
// router.get(
//   "/published",
//   productController.getPublishedProducts.bind(productController),
// );
// router.get(
//   "/latest",
//   productController.getLatestProducts.bind(productController),
// );
// router.get(
//   "/top-rated",
//   productController.getTopRatedProducts.bind(productController),
// );
// router.get(
//   "/top-ten",
//   productController.getTopTenProducts.bind(productController),
// );

// router.get(
//   "/:id",
//   validate(idParamSchema, "params"),
//   productController.getProductById.bind(productController),
// );
// router.get(
//   "/:id/related",
//   validate(idParamSchema, "params"),
//   productController.getRelatedProducts.bind(productController),
// );

export default {
  path: "/products",
  router,
};
