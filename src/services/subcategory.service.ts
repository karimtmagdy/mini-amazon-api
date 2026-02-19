import { ApiError } from "../class/api.error";
import {
  CreateSubCategory,
  UpdateSubCategory,
} from "../schema/subcategory.schema";
import { SubCategoryRepo, subCategoryRepo } from "../repo/subcategory.repo";
import { QueryString } from "../schema/standred.schema";

export class SubCategoryService {
  constructor(private readonly subCategoryRepo: SubCategoryRepo) {}

  async create(data: CreateSubCategory) {
    const nameExists = await this.subCategoryRepo.findByName(data.name);
    if (nameExists) {
      throw new ApiError("Subcategory name already exists", 400);
    }
    const subCategory = await this.subCategoryRepo.create(data as any);
    return { subCategory };
  }
  async update(id: string, data: UpdateSubCategory) {
    const exists = await this.subCategoryRepo.findById(id);
    if (!exists) throw new ApiError("subCategory not found", 404);

    if (data.name) {
      const nameExists = await this.subCategoryRepo.findByName(data.name);
      if (nameExists && nameExists._id.toString() !== id) {
        throw new ApiError("Subcategory name already exists", 400);
      }
    }

    const subCategory = await this.subCategoryRepo.update(id, data as any);
    if (!subCategory) throw new ApiError("subCategory not found", 404);
    return { subCategory };
  }
  async delete(id: string) {
    const subCategory = await this.subCategoryRepo.delete(id);
    if (!subCategory) throw new ApiError("subCategory not found", 404);
    return { subCategory };
  }
  async findById(id: string) {
    const subCategory = await this.subCategoryRepo.findById(id);
    if (!subCategory) throw new ApiError("subCategory not found", 404);
    return { subCategory };
  }
  async findAll(query: QueryString) {
    const subCategories = await this.subCategoryRepo.findAll(query);
    return { subCategories };
  }
}
export const subCategoryService = new SubCategoryService(subCategoryRepo);
