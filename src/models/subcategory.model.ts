import { model, Schema, Types } from "mongoose";
import slugify from "slugify";
import { SubCategoryDto } from "../contract/subcategory.dto";

const SubCategorySchema = new Schema<SubCategoryDto>(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [32, "Name must be at most 32 characters"],
    },
    slug: { type: String, trim: true },
    description: {
      type: String,
      trim: true,
      minlength: [10, "Description must be at least 10 characters"],
      maxlength: [500, "Description must be at most 500 characters"],
    },
    category: [{ type: Types.ObjectId, ref: "Category", required: true }],
    products: { type: Number, default: 0 },
    deletedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
    collection: "subcategories",
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform(_doc, ret) {
        const safeRet = ret as Partial<typeof ret>;
        delete safeRet.__v;
        delete safeRet._id;
        return safeRet;
      },
    },
    toObject: { virtuals: true },
  },
);

SubCategorySchema.pre("save", function () {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
});

SubCategorySchema.pre("findOneAndUpdate", function () {
  const update = this.getUpdate() as any;
  if (update && update.name) {
    update.slug = slugify(update.name, { lower: true, strict: true });
  }
});

export const SubCategory = model<SubCategoryDto>(
  "SubCategory",
  SubCategorySchema,
);
