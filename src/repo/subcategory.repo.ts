import { UpdateQuery } from "mongoose";
import { SubCategoryDto } from "../contract/subcategory.dto";
import { SubCategory } from "../models/subcategory.model";
import { QueryString } from "../schema/standred.schema";
import { APIFeatures } from "../class/api.feature";

export class SubCategoryRepo {
  async create(data: SubCategoryDto) {
    const subCategory = await SubCategory.create(data);
    return subCategory;
  }
  async update(id: string, data: UpdateQuery<SubCategoryDto>) {
    const subCategory = await SubCategory.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    return subCategory;
  }
  async delete(id: string) {
    const category = await SubCategory.findByIdAndUpdate(id, { new: true });
    return category;
  }
  async findById(id: string) {
    const subCategory = await SubCategory.findById(id)
      .populate("category", "name")
      .lean();
    return subCategory;
  }
  async findAll(query: QueryString) {
    const features = new APIFeatures(SubCategory, query);
    const subCategories = await features
      .filter()
      .populate({ path: "category", select: "name" })
      .populate("products")
      .sort()
      .limitFields()
      .paginate()
      .search(["name"])
      .execute();

    return subCategories;
  }
}
export const subCategoryRepo = new SubCategoryRepo();
