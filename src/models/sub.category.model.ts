// import { model, Schema, Types } from "mongoose";
// import slugify from "slugify";

// import { ISubCategory } from "@/types/sub.category.dto";

// const SubCategorySchema = new Schema<ISubCategory>(
//   {
//     name: {
//       type: String,
//       trim: true,
//       required: true,
//       unique: true,
//       minlength: 2,
//       maxlength: 32,
//     },
//     slug: { type: String, trim: true },
//     description: { type: String, trim: true, minlength: 10, maxlength: 500 },
//     category: [{ type: Types.ObjectId, ref: "Category", required: true }],
//     isActive: { type: Boolean, default: true },
//     deletedAt: { type: Date, default: null },
//   },
//   {
//     timestamps: true,
//     collection: "subcategories",
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

// SubCategorySchema.pre("save", function () {
//   const doc = this as unknown as ISubCategory;
//   if (doc.name) {
//     doc.slug = slugify(doc.name, { lower: true, strict: true });
//   }
// });
// SubCategorySchema.pre("findOneAndUpdate", function () {
//   const doc = this as unknown as ISubCategory;
//   if (doc.name) {
//     doc.slug = slugify(doc.name, { lower: true, strict: true });
//   }
// });
// export const SubCategory = model<ISubCategory>(
//   "SubCategory",
//   SubCategorySchema
// );
