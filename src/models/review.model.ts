import { model, Schema, Types } from "mongoose";
import { ReviewDto } from "../contract/review.dto";
import { Product } from "./product.model";

const ReviewSchema = new Schema<ReviewDto>(
  {
    comment: {
      type: String,
      required: [true, "Review comment is required"],
      trim: true,
      minlength: [3, "Too short review comment"],
    },
    ratings: {
      type: Number,
      min: [1, "Min rating value is 1.0"],
      max: [5, "Max rating value is 5.0"],
      required: [true, "Review ratings is required"],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user"],
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Review must belong to a product"],
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(_doc, ret) {
        const safeRet = ret as Partial<typeof ret>;
        delete safeRet.__v;
        delete safeRet._id;
        return safeRet;
      },
    },
    toObject: { virtuals: true },
  }
);

// Aggregation for ratingsAverage and ratingsCount on Product
ReviewSchema.statics.calcAverageRatingsAndQuantity = async function (
  productId: Types.ObjectId
) {
  const stats = await this.aggregate([
    {
      $match: { product: productId },
    },
    {
      $group: {
        _id: "$product",
        avgRatings: { $avg: "$ratings" },
        ratingsQuantity: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      ratingsAverage: Math.round(stats[0].avgRatings * 10) / 10,
      ratingsCount: stats[0].ratingsQuantity,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      ratingsAverage: 0,
      ratingsCount: 0,
    });
  }
};

ReviewSchema.post("save", async function () {
  const ReviewModel = this.constructor as any;
  await ReviewModel.calcAverageRatingsAndQuantity(this.product);
});

ReviewSchema.pre("findOneAndUpdate", async function () {
    const docToUpdate = await this.model.findOne(this.getQuery());
    if (docToUpdate) {
      (this as any)._oldProductId = docToUpdate.product;
    }
});

ReviewSchema.post("findOneAndUpdate", async function (doc) {
  if (doc) {
    const ReviewModel = doc.constructor as any;
    await ReviewModel.calcAverageRatingsAndQuantity(doc.product);
    
    // If product ID changed, update the old product as well
    const oldProductId = (this as any)._oldProductId;
    if (oldProductId && oldProductId.toString() !== doc.product.toString()) {
        await ReviewModel.calcAverageRatingsAndQuantity(oldProductId);
    }
  }
});

ReviewSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    const ReviewModel = doc.constructor as any;
    await ReviewModel.calcAverageRatingsAndQuantity(doc.product);
  }
});

export const Review = model<ReviewDto>("Review", ReviewSchema);
