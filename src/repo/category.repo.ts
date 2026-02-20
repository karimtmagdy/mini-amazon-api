import { UpdateQuery } from "mongoose";
import { CategoryDto, CategoryStatusEnum } from "../contract/category.dto";
import { Category } from "../models/category.model";
import { Product } from "../models/product.model";
import { QueryString } from "../schema/standred.schema";
import { APIFeatures } from "../class/api.feature";

export class CategoryRepo {
  async create(data: CategoryDto) {
    const category = await Category.create(data);
    return category;
  }
  async findByName(name: string) {
    const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return await Category.findOne({
      name: { $regex: new RegExp(`^${escapedName}$`, "i") },
    }).lean();
  }
  async update(id: string, data: UpdateQuery<CategoryDto>) {
    const category = await Category.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    return category;
  }
  async softDelete(id: string) {
    const category = await Category.findByIdAndUpdate(
      id,
      { status: CategoryStatusEnum.ARCHIVED, deletedAt: new Date() },
      { new: true },
    );
    return category;
  }
  async findById(id: string) {
    const category = await Category.findById(id).lean();
    return category;
  }
  async findAll(query: QueryString) {
    const features = new APIFeatures(Category, query);
    const categories = await features
      .filter()
      .sort()
      .limitFields()
      .paginate()
      .search(["name"])
      .execute();

    return categories;
  }

  async getCategoryStats() {
    const stats = await Product.aggregate([
      {
        $match: { deletedAt: null, status: "active" },
      },
      {
        $unwind: "$category",
      },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },
      {
        $unwind: "$categoryDetails",
      },
      {
        $project: {
          _id: 1,
          name: "$categoryDetails.name",
          slug: "$categoryDetails.slug",
          count: 1,
          avgPrice: { $round: ["$avgPrice", 2] },
          minPrice: 1,
          maxPrice: 1,
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);
    return stats;
  }
}
export const categoryRepo = new CategoryRepo();
