import { CreateCategory, UpdateCategory } from "../schema/category.schema";
import { CategoryRepo, categoryRepo } from "../repo/category.repo";
import { cloudService } from "../config/cloudinary";
import { CategoryDto } from "../contract/category.dto";
import fs from "fs";
import { QueryString } from "../schema/standred.schema";
import { ErrorFactory } from "../class/error.factory";

export class CategoryService {
  constructor(private readonly categoryRepo: CategoryRepo) {}

  async create(data: CreateCategory, file?: Express.Multer.File) {
    const exists = await this.categoryRepo.findByName(data.name);
    if (exists) {
      ErrorFactory.throwBadRequest("Category name already exists");
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
  async update(
    categoryId: string,
    data: UpdateCategory,
    file?: Express.Multer.File,
  ) {
    const exists = await this.categoryRepo.findById(categoryId);
    if (!exists) ErrorFactory.throwNotFound("Category not found");

    if (data.name) {
      const exists = await this.categoryRepo.findByName(data.name);
      if (exists && exists._id.toString() !== categoryId) {
        ErrorFactory.throwBadRequest("Category name already exists");
      }
    }

    let image = exists?.image;
    if (file) {
      const { url, publicId } = await cloudService.uploadSinglePhoto(
        file.path,
        "categories",
      );
      fs.unlinkSync(file.path);
      image = { url, publicId };
      if (exists?.image?.publicId) {
        await cloudService.deletePhoto(exists.image.publicId);
      }
    }
    const updateData: Partial<CategoryDto> = {
      ...data,
      image,
    };
    const category = await this.categoryRepo.update(
      categoryId,
      updateData as any,
    );
    if (!category) ErrorFactory.throwNotFound("Category not found");
    return { category };
  }
  async softDelete(categoryId: string) {
    const category = await this.categoryRepo.softDelete(categoryId);
    if (!category) ErrorFactory.throwNotFound("Category not found");
    return { category };
  }
  async findById(categoryId: string) {
    const category = await this.categoryRepo.findById(categoryId);
    if (!category) ErrorFactory.throwNotFound("Category not found");
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
