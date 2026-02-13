// import { model, Schema, Types } from "mongoose";
// import slugify from "slugify";

// import { PRODUCT_STATUS } from "@/types";
// import { IProduct } from "@/types/product.dto";

// const ProductSchema = new Schema<IProduct>(
//   {
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//       unique: true,
//       minlength: 3,
//       maxlength: 100,
//     },
//     description: { type: String, trim: true, minlength: 10, maxlength: 1000 },
//     price: { type: Number, required: true, trim: true, min: 0, max: 1_000_000 },
//     stock: { type: Number, default: 0, required: true },
//     sold: { type: Number, default: 0 },
//     status: { type: String, enum: PRODUCT_STATUS, default: "active" },
//     isActive: { type: Boolean, default: true },
//     cover: {
//       url: {
//         type: String,
//         default: "https://ui.shadcn.com/placeholder.svg",
//       },
//       publicId: { type: String, default: "" },
//     },
//     sku: { type: String, unique: true, sparse: true },
//     discount: { type: Number, default: 0, min: 0, max: 100 },
//     PriceAfterDiscount: { type: Number, default: 0 },
//     slug: { type: String, trim: true, unique: true },
//     images: {
//       type: [
//         {
//           url: String,
//           publicId: String,
//         },
//       ],
//       validate: [
//         (val: any[]) => val.length <= 5,
//         "{PATH} exceeds the limit of 5",
//       ],
//     },
//     brand: { type: Types.ObjectId, ref: "Brand", required: false },
//     category: [{ type: Types.ObjectId, ref: "Category" }],
//     subcategory: [{ type: Types.ObjectId, ref: "SubCategory" }],
//     ratings_average: {
//       type: Number,
//       default: 0,
//       min: [0, "Rating must be at least 0"],
//       max: [5, "Rating cannot be more than 5"],
//       set: (val: number) => Math.round(val * 10) / 10,
//     },
//     ratings_count: { type: Number, default: 0 },
//     isPublished: { type: Boolean, default: false, sparse: true },
//     colors: [String],
//     tags: {
//       type: [String],
//       default: [],
//       validate: {
//         validator: function (tags: string[]) {
//           return tags.length <= 10;
//         },
//         message: "Tags cannot exceed 10 items",
//       },
//     },
//     deletedAt: { type: Date, default: null },
//   },
//   {
//     timestamps: true,
//     collection: "products",
//     toJSON: {
//       virtuals: true,
//       versionKey: false,
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

// ProductSchema.pre("save", function () {
//   if (this.isModified("name")) {
//     this.slug = slugify(this.name, { lower: true, strict: true });
//   }

//   if (this.isModified("price") || this.isModified("discount")) {
//     this.PriceAfterDiscount = this.price - (this.price * this.discount) / 100;
//   }

//   if (!this.sku) {
//     this.sku = `${this.name.slice(0, 3).toUpperCase()}-${Date.now()}`;
//   }
// });

// ProductSchema.pre("findOneAndUpdate", function () {
//   const update = this.getUpdate() as any;

//   if (update.name) {
//     update.slug = slugify(update.name, { lower: true, strict: true });
//   }

//   const price = update.price;
//   const discount = update.discount;

//   if (price !== undefined || discount !== undefined) {
//     // Note: In a real app, you might need to fetch the existing document if one is missing,
//     // but here we assume if one is provided in the update, we recalulate or it's a partial update.
//     // For a more robust solution, we'd need to fetch the doc, but that adds overhead.
//     // We'll just calculate if BOTH are present in the update for now to keep it simple and efficient.
//     if (price !== undefined && discount !== undefined) {
//       update.PriceAfterDiscount = price - (price * discount) / 100;
//     }
//   }
// });

// ProductSchema.statics.findActiveProducts = function () {
//   return this.find({ isActive: true, stock: { $gt: 0 }, deletedAt: null });
// };

// ProductSchema.virtual("isAvailable").get(function () {
//   return this.stock > 0 && this.isActive && !this.deletedAt
//     ? "in stock"
//     : "out of stock";
// });

// ProductSchema.methods.hasEnoughStock = function (quantity: number): boolean {
//   return this.stock >= quantity;
// };

// ProductSchema.index({ name: "text", description: "text" });

// export const Product = model<IProduct>("Product", ProductSchema);
