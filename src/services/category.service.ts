import { ApiError } from "../class/api.error";
import { CreateCategory, UpdateCategory } from "../schemas/category.schema";
import { CategoryRepo, categoryRepo } from "../repo/category.repo";
import { cloudService } from "../config/cloudinary";
import { CategoryDto } from "../contract/category.dto";
import fs from "fs";
import { QueryString } from "../schemas/standred.schema";

export class CategoryService {
  constructor(private readonly categoryRepo: CategoryRepo) {}

  async create(data: CreateCategory, file?: Express.Multer.File) {
    const defaultImage = { url: "", publicId: "" };

    let categoryData: CategoryDto = {
      ...data,
      slug: "", // Handled by Mongoose middleware
      image: data.image || defaultImage,
      status: data.status || "active",
      description: data.description,
      productsCount: 0,
      deletedAt: null,
    };

    if (file) {
      const { url, publicId } = await cloudService.uploadSinglePhoto(
        file.path,
        "categories",
      );
      fs.unlinkSync(file.path);
      categoryData.image = { url, publicId };
    }

    const category = await this.categoryRepo.create(categoryData);
    return { category };
  }
  async update(id: string, data: UpdateCategory, file?: Express.Multer.File) {
    const existCategory = await this.categoryRepo.findById(id);
    if (!existCategory) throw new ApiError("Category not found", 404);

    let image = existCategory.image;
    if (file) {
      const { url, publicId } = await cloudService.uploadSinglePhoto(
        file.path,
        "categories",
      );
      fs.unlinkSync(file.path);
      image = { url, publicId };
      if (existCategory.image?.publicId) {
        await cloudService.deletePhoto(existCategory.image.publicId);
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
