// import { model, Schema, Types } from "mongoose";
// import { IReview } from "@/types/review.dto";
// import { Product } from "./product.model";

// const ReviewSchema = new Schema<IReview>(
//   {
//     comment: {
//       type: String,
//       required: [true, "Review comment is required"],
//       trim: true,
//       minlength: [3, "Too short review comment"],
//     },
//     ratings: {
//       type: Number,
//       min: [1, "Min rating value is 1.0"],
//       max: [5, "Max rating value is 5.0"],
//       required: [true, "Review ratings is required"],
//     },
//     user: {
//       type: Schema.Types.ObjectId,
//       ref: "User",
//       required: [true, "Review must belong to a user"],
//     },
//     product: {
//       type: Schema.Types.ObjectId,
//       ref: "Product",
//       required: [true, "Review must belong to a product"],
//     },
//   },
//   {
//     timestamps: true,
//     toJSON: {
//       virtuals: true,
//       transform(_doc, ret) {
//         const safeRet = ret as Partial<typeof ret>;
//         delete safeRet.__v;
//         delete safeRet._id;
//         return safeRet;
//       },
//     },
//     toObject: { virtuals: true },
//   }
// );

// ReviewSchema.statics.calcAverageRatingsAndQuantity = async function (
//   productId: string
// ) {
//   const result = await this.aggregate([
//     {
//       $match: { product: new Types.ObjectId(productId) },
//     },
//     {
//       $group: {
//         _id: "product",
//         avgRatings: { $avg: "$ratings" },
//         ratingsQuantity: { $sum: 1 },
//       },
//     },
//   ]);

//   if (result.length > 0) {
//     await Product.findByIdAndUpdate(productId, {
//       ratings_average: result[0].avgRatings,
//       ratings_count: result[0].ratingsQuantity,
//     });
//   } else {
//     await Product.findByIdAndUpdate(productId, {
//       ratings_average: 0,
//       ratings_count: 0,
//     });
//   }
// };

// ReviewSchema.post("save", async function (doc) {
//   await (doc.constructor as any).calcAverageRatingsAndQuantity(doc.product);
// });

// ReviewSchema.post("findOneAndDelete", async function (doc) {
//   if (doc) {
//     await doc.constructor.calcAverageRatingsAndQuantity(doc.product);
//   }
// });

// // Since we are using update manually in repository or service, we might need to handle updates too
// // If we use findOneAndUpdate, we can use a post hook for it as well
// ReviewSchema.post("findOneAndUpdate", async function (doc) {
//   if (doc) {
//     await doc.constructor.calcAverageRatingsAndQuantity(doc.product);
//   }
// });

// export const Review = model<IReview>("Review", ReviewSchema);
