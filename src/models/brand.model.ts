import { model, Schema } from "mongoose";
import { BRAND_STATUS, BrandDto } from "../contract/brand.dto";
import slugify from "slugify";

const BrandSchema = new Schema<BrandDto>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      minlength: [2, "Name must be at least 2 characters long"],
      maxlength: [30, "Name must be at most 30 characters long"],
    },
    image: {
      url: { type: String },
      publicId: { type: String },
    },
    status: { type: String, enum: BRAND_STATUS, default: "active" },
    slug: { type: String, trim: true },
    productsCount: { type: Number, default: 0 },
    deletedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
    collection: "brands",
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
BrandSchema.pre("save", function () {
  const doc = this as unknown as BrandDto;
  if (doc.name) {
    doc.slug = slugify(doc.name, { lower: true, strict: true });
  }
});
BrandSchema.pre("findOneAndUpdate", function () {
  const doc = this.getUpdate() as Partial<BrandDto>;
  if (doc && doc.name) {
    doc.slug = slugify(doc.name, { lower: true, strict: true });
  }
});
BrandSchema.index({ name: "text" });
// BrandSchema.pre("find", function () {
//   this.where({ deletedAt: null });
// });
// BrandSchema.pre("findOne", function () {
//   this.where({ deletedAt: null });
// });
export const Brand = model<BrandDto>("Brand", BrandSchema);
