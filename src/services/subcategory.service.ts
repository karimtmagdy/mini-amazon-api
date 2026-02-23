import {
  CreateSubCategory,
  UpdateSubCategory,
} from "../schema/subcategory.schema";
import { SubCategoryRepo, subCategoryRepo } from "../repo/subcategory.repo";
import { QueryString } from "../schema/standred.schema";
import { ErrorFactory } from "../class/error.factory";

export class SubCategoryService {
  constructor(private readonly subCategoryRepo: SubCategoryRepo) {}

  async create(data: CreateSubCategory) {
    const exists = await this.subCategoryRepo.findByName(data.name);
    if (exists) {
      ErrorFactory.throwBadRequest("Subcategory name already exists");
    }
    const subCategory = await this.subCategoryRepo.create(data as any);
    return { subCategory };
  }
  async update(subCategoryId: string, data: UpdateSubCategory) {
    const exists = await this.subCategoryRepo.findById(subCategoryId);
    if (!exists) ErrorFactory.throwNotFound("subCategory not found");

    if (data.name) {
      const exists = await this.subCategoryRepo.findByName(data.name);
      if (exists && exists._id.toString() !== subCategoryId) {
        ErrorFactory.throwBadRequest("Subcategory name already exists");
      }
    }

    const subCategory = await this.subCategoryRepo.update(
      subCategoryId,
      data as any,
    );
    if (!subCategory) ErrorFactory.throwNotFound("subCategory not found");
    return { subCategory };
  }
  async delete(subCategoryId: string) {
    const subCategory = await this.subCategoryRepo.delete(subCategoryId);
    if (!subCategory) ErrorFactory.throwNotFound("subCategory not found");
    return { subCategory };
  }
  async findById(subCategoryId: string) {
    const subCategory = await this.subCategoryRepo.findById(subCategoryId);
    if (!subCategory) ErrorFactory.throwNotFound("subCategory not found");
    return { subCategory };
  }
  async findAll(query: QueryString) {
    const subCategories = await this.subCategoryRepo.findAll(query);
    return { subCategories };
  }
}
export const subCategoryService = new SubCategoryService(subCategoryRepo);
