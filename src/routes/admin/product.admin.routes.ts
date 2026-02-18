import { Router } from "express";
import { productController } from "../../controllers/product.controller";
import { validate } from "../../middlewares/validate";
import {
  createProductZod,
  //   updateProductSchema,
  //   updateStockSchema,
} from "../../schema/product.schema";
import { authenticated, checkPermission } from "../../middlewares/authroized";
// import {
//   idParamSchema,
//   multipleBulkDeleteSchema,
// } from "@/schema/global.schema";

const router = Router();

router.use(authenticated, checkPermission(["admin", "manager"]));

router.post("/", validate(createProductZod), productController.create);

// router.get(
//   "/inactive",
//   authorize(["admin"]),
//   productController.getInactiveProducts.bind(productController)
// );

// router.get(
//   "/unpublished",
//   authorize(["admin"]),
//   productController.getUnpublishedProducts.bind(productController)
// );

// router.delete(
//   "/bulk",
//   authorize(["admin"]),
//   validate(multipleBulkDeleteSchema, "body"),
//   productController.deleteBulkProducts.bind(productController)
// );

// router
//   .route("/:id")
//   .patch(
//     validate(idParamSchema, "params"),
//     validate(updateProductSchema),
//     productController.updateProduct.bind(productController)
//   )
//   .delete(
//     authorize(["admin"]),
//     validate(idParamSchema, "params"),
//     productController.deleteProduct.bind(productController)
//   );

// router.patch(
//   "/:id/stock",
//   authorize(["admin"]),
//   validate(idParamSchema, "params"),
//   validate(updateStockSchema),
//   productController.updateStock.bind(productController)
// );

export default {
  router,
  path: "/products",
};
