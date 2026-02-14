import { model, Schema } from "mongoose";
import { CATEGORY_STATUS, CategoryDto } from "../contract/category.dto";
import slugify from "slugify";

const CategorySchema = new Schema<CategoryDto>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      minlength: [3, "Category name must be at least 3 characters long"],
      maxlength: [30, "Category name must be at most 30 characters long"],
    },
    image: { url: { type: String }, publicId: { type: String } },
    description: {
      type: String,
      trim: true,
      minlength: [
        10,
        "Category description must be at least 10 characters long",
      ],
      maxlength: [
        100,
        "Category description must be at most 100 characters long",
      ],
    },
    slug: { type: String, trim: true },
    status: { type: String, enum: CATEGORY_STATUS, default: "active" },
    deletedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
    collection: "categories",
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
CategorySchema.pre("save", function () {
  const doc = this as unknown as CategoryDto;
  if (doc.name) {
    doc.slug = slugify(doc.name, { lower: true, strict: true });
  }
});
CategorySchema.pre("findOneAndUpdate", function () {
  const doc = this.getUpdate() as Partial<CategoryDto>;
  if (doc && doc.name) {
    doc.slug = slugify(doc.name, { lower: true, strict: true });
  }
});
CategorySchema.index({ name: "text" });
export const Category = model<CategoryDto>("Category", CategorySchema);
