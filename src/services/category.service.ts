import { ApiError } from "../class/api.error";
import { CreateCategory, UpdateCategory } from "../schema/category.schema";
import { CategoryRepo, categoryRepo } from "../repo/category.repo";
import { cloudService } from "../config/cloudinary";
import { CategoryDto } from "../contract/category.dto";
import fs from "fs";
import { QueryString } from "../schema/standred.schema";

export class CategoryService {
  constructor(private readonly categoryRepo: CategoryRepo) {}

  async create(data: CreateCategory, file?: Express.Multer.File) {
    const nameExists = await this.categoryRepo.findByName(data.name);
    if (nameExists) {
      throw new ApiError("Category name already exists", 400);
    }

    if (file) {
      const { url, publicId } = await cloudService.uploadSinglePhoto(
        file.path,
        "categories",
      );
      fs.unlinkSync(file.path);
      data.image = { url, publicId };
    }
    const category = await this.categoryRepo.create(data as any);
    return { category };
  }
  async update(id: string, data: UpdateCategory, file?: Express.Multer.File) {
    const exists = await this.categoryRepo.findById(id);
    if (!exists) throw new ApiError("Category not found", 404);

    if (data.name) {
      const nameExists = await this.categoryRepo.findByName(data.name);
      if (nameExists && nameExists._id.toString() !== id) {
        throw new ApiError("Category name already exists", 400);
      }
    }

    let image = exists.image;
    if (file) {
      const { url, publicId } = await cloudService.uploadSinglePhoto(
        file.path,
        "categories",
      );
      fs.unlinkSync(file.path);
      image = { url, publicId };
      if (exists.image?.publicId) {
        await cloudService.deletePhoto(exists.image.publicId);
      }
    }
    const updateData: Partial<CategoryDto> = {
      ...data,
      image,
    };
    const category = await this.categoryRepo.update(id, updateData as any);
    if (!category) throw new ApiError("Category not found", 404);
    return { category };
  }
  async softDelete(id: string) {
    const category = await this.categoryRepo.softDelete(id);
    if (!category) throw new ApiError("Category not found", 404);
    return { category };
  }
  async findById(id: string) {
    const category = await this.categoryRepo.findById(id);
    if (!category) throw new ApiError("Category not found", 404);
    return { category };
  }
  async findAll(query: QueryString) {
    const categories = await this.categoryRepo.findAll(query);
    return { categories };
  }
  async getStats() {
    const stats = await this.categoryRepo.getCategoryStats();
    return { stats };
  }
}
export const categoryService = new CategoryService(categoryRepo);
