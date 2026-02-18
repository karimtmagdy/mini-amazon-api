import { model, Schema, Types } from "mongoose";
import slugify from "slugify";
import { PRODUCT_STATUS, ProductDto } from "../contract/product.dto";
import { Category } from "./category.model";
import { Brand } from "./brand.model";
import { SubCategory } from "./subcategory.model";

const ProductSchema = new Schema<ProductDto>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      minlength: 3,
      maxlength: 100,
    },
    // description: { type: String, trim: true, minlength: 10, maxlength: 1000 },
    // price: { type: Number, required: true, trim: true, min: 0, max: 1_000_000 },
    stock: { type: Number, default: 0, required: true },
    sold: { type: Number, default: 0 },
    status: { type: String, enum: PRODUCT_STATUS, default: "active" },
    cover: {
      url: {
        type: String,
        default: "https://ui.shadcn.com/placeholder.svg",
      },
      publicId: { type: String, default: "" },
    },
    sku: { type: String, unique: true, sparse: true },
    // discount: { type: Number, default: 0, min: 0, max: 100 },
    // PriceAfterDiscount: { type: Number, default: 0 },
    // slug: { type: String, trim: true, unique: true },
    // images: {
    //   type: [
    //     {
    //       url: String,
    //       publicId: String,
    //     },
    //   ],
    //   validate: [
    //     (val: any[]) => val.length <= 5,
    //     "{PATH} exceeds the limit of 5",
    //   ],
    // },
    brand: { type: Schema.Types.ObjectId, ref: "Brand", required: false },
    category: [{ type: Schema.Types.ObjectId, ref: "Category" }],
    subcategory: [{ type: Schema.Types.ObjectId, ref: "SubCategory" }],
    // ratingsAverage: {
    //   type: Number,
    //   default: 0,
    //   min: [0, "Rating must be at least 0"],
    //   max: [5, "Rating cannot be more than 5"],
    //   set: (val: number) => Math.round(val * 10) / 10,
    // },
    // ratingsCount: { type: Number, default: 0 },
    // colors: [String],
    // tags: {
    //   type: [String],
    //   default: [],
    //   validate: {
    //     validator: function (tags: string[]) {
    //       return tags.length <= 10;
    //     },
    //     message: "Tags cannot exceed 10 items",
    //   },
    // },
    deletedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
    collection: "products",
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

// Unified Aggregation logic for Category, Brand, and SubCategory productsCount
ProductSchema.statics.countProductsForModels = async function (
  ids: Types.ObjectId[],
  field: "category" | "brand" | "subcategory",
  Model: any,
) {
  if (!ids || ids.length === 0) return;

  const stats = await this.aggregate([
    {
      $match: {
        [field]: { $in: ids },
        deletedAt: null,
        status: "active",
      },
    },
    { $unwind: `$${field}` },
    { $match: { [field]: { $in: ids } } },
    { $group: { _id: `$${field}`, nProduct: { $sum: 1 } } },
  ]);

  const statsMap = new Map(
    stats.map((s: any) => [s._id.toString(), s.nProduct]),
  );

  for (const id of ids) {
    const count = statsMap.get(id.toString()) || 0;
    await Model.findByIdAndUpdate(id, { productsCount: count });
  }
};

ProductSchema.pre("save", function () {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }

  if (this.isModified("price") || this.isModified("discount")) {
    this.PriceAfterDiscount = this.price - (this.price * this.discount) / 100;
  }

  if (!this.sku) {
    this.sku = `${this.name.slice(0, 3).toUpperCase()}-${Date.now()}`;
  }
});

ProductSchema.post("save", async function () {
  const ProductModel = this.constructor as any;
  if (this.category?.length > 0) {
    await ProductModel.countProductsForModels(
      this.category,
      "category",
      Category,
    );
  }
  if (this.brand) {
    await ProductModel.countProductsForModels([this.brand], "brand", Brand);
  }
  if (this.subcategory?.length > 0) {
    await ProductModel.countProductsForModels(
      this.subcategory,
      "subcategory",
      SubCategory,
    );
  }
});

ProductSchema.pre("findOneAndUpdate", async function () {
  const docToUpdate = await this.model.findOne(this.getQuery());
  if (docToUpdate) {
    (this as any)._oldValues = {
      category: docToUpdate.category,
      brand: docToUpdate.brand,
      subcategory: docToUpdate.subcategory,
    };
  }
});

ProductSchema.post("findOneAndUpdate", async function (doc) {
  if (!doc) return;
  const ProductModel = this.model as any;
  const oldValues = (this as any)._oldValues || {};

  const updateStats = async (
    field: "category" | "brand" | "subcategory",
    Model: any,
  ) => {
    const oldVal = oldValues[field]
      ? Array.isArray(oldValues[field])
        ? oldValues[field]
        : [oldValues[field]]
      : [];
    const newVal = doc[field]
      ? Array.isArray(doc[field])
        ? doc[field]
        : [doc[field]]
      : [];

    const allIds = [
      ...new Set([
        ...oldVal.map((id: any) => id.toString()),
        ...newVal.map((id: any) => id.toString()),
      ]),
    ]
      .filter(Boolean)
      .map((id) => new Types.ObjectId(id));

    if (allIds.length > 0) {
      await ProductModel.countProductsForModels(allIds, field, Model);
    }
  };

  await updateStats("category", Category);
  await updateStats("brand", Brand);
  await updateStats("subcategory", SubCategory);
});

ProductSchema.post("findOneAndDelete", async function (doc) {
  if (!doc) return;
  const ProductModel = doc.constructor as any;
  if (doc.category?.length > 0) {
    await ProductModel.countProductsForModels(
      doc.category,
      "category",
      Category,
    );
  }
  if (doc.brand) {
    await ProductModel.countProductsForModels([doc.brand], "brand", Brand);
  }
  if (doc.subcategory?.length > 0) {
    await ProductModel.countProductsForModels(
      doc.subcategory,
      "subcategory",
      SubCategory,
    );
  }
});

ProductSchema.statics.findActiveProducts = function () {
  return this.find({ status: "active", stock: { $gt: 0 }, deletedAt: null });
};

ProductSchema.virtual("isAvailable").get(function () {
  return this.stock > 0 && this.status === "active" && !this.deletedAt
    ? "in stock"
    : "out of stock";
});

ProductSchema.methods.hasEnoughStock = function (quantity: number): boolean {
  return this.stock >= quantity;
};

ProductSchema.index({ name: "text", description: "text" });

export const Product = model<ProductDto>("Product", ProductSchema);
