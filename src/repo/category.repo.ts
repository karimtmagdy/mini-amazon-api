import { UpdateQuery } from "mongoose";
import { CategoryDto, CategoryStatusEnum } from "../contract/category.dto";
import { Category } from "../models/category.model";

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
  async findAll() {
    const categories = await Category.find({
      status: CategoryStatusEnum.ACTIVE,
    })
      .sort({ createdAt: -1 })
      .skip(0)
      .limit(10)
      .lean();
    return categories;
  }
}
export const categoryRepo = new CategoryRepo();
