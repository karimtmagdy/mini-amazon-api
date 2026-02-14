import { UpdateQuery } from "mongoose";
import { CategoryDto, CategoryStatusEnum } from "../contract/category.dto";
import { Category } from "../models/category.model";
import { QueryString } from "../schemas/standred.schema";
import { APIFeatures } from "../class/api.feature";

export class CategoryRepo {
  async create(data: CategoryDto) {
    const category = await Category.create(data);
    return category;
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
      { status: CategoryStatusEnum.INACTIVE, deletedAt: new Date() },
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
}
export const categoryRepo = new CategoryRepo();
