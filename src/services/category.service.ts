import { ApiError } from "../class/api.error";
import { CategoryDto } from "../contract/category.dto";
import { CategoryRepo, categoryRepo } from "../repo/category.repo";

export class CategoryService {
  constructor(private readonly categoryRepo: CategoryRepo) {}

  async create(data: CategoryDto) {
    const category = await this.categoryRepo.create(data);
    return { category };
  }
  async update(id: string, data: CategoryDto) {
    const category = await this.categoryRepo.update(id, data);
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
  async findAll() {
    const categories = await this.categoryRepo.findAll();
    return { categories };
  }
}
export const categoryService = new CategoryService(categoryRepo);
