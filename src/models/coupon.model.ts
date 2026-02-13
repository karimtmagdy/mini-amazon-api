// import { model, Schema } from "mongoose";
// import { ICoupon } from "@/types/coupon.dto";

// const CouponSchema = new Schema<ICoupon>(
//   {
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//       unique: true,
//       minlength: 3,
//       maxlength: 50,
//       uppercase: true,
//     },
//     expiry: { type: Date, required: true },
//     discount: { type: Number, required: true, min: 1, max: 100 },
//     isActive: { type: Boolean, default: true },
//     deletedAt: { type: Date, default: null },
//   },
//   {
//     timestamps: true,
//     collection: "coupons",
//     toJSON: {
//       virtuals: true,
//       versionKey: false,
//       transform(_doc, ret) {
//         const safeRet = ret as Partial<typeof ret>;
//         delete safeRet._id;
//         delete safeRet.__v;
//         return safeRet;
//       },
//     },
//     toObject: { virtuals: true },
//   }
// );

// // CouponSchema.index({ name: 1 });

// export const Coupon = model<ICoupon>("Coupon", CouponSchema);
