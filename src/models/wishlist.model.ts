// import { model, Schema, Types } from "mongoose";
// import { IWishlist } from "@/types/wishlist.dto";

// const WishlistSchema = new Schema<IWishlist>(
//   {
//     user: {
//       type: Types.ObjectId,
//       ref: "User",
//       required: [true, "Wishlist must belong to a user"],
//       unique: true,
//     },
//     products: [
//       {
//         type: Types.ObjectId,
//         ref: "Product",
//       },
//     ],
//   },
//   {
//     timestamps: true,
//     toJSON: {
//       virtuals: true,
//       transform(_doc, ret) {
//         const safeRet = ret as Partial<typeof ret>
//         delete safeRet.__v;
//         delete safeRet._id;
//         return safeRet;
//       },
//     },
//     toObject: { virtuals: true },
//   }
// );

// export const Wishlist = model<IWishlist>("Wishlist", WishlistSchema);
