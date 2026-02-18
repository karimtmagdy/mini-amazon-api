import { ApiError } from "../class/api.error";
import { ProductRepo, productRepo } from "../repo/product.repo";
import { CreateProduct } from "../schema/product.schema";
import { QueryString } from "../schema/standred.schema";

export class ProductService {
  constructor(private readonly productRepo: ProductRepo) {}
  async create(data: CreateProduct) {
    const product = await this.productRepo.create(data);
    return { product };
  }
  async update(id: string, data: CreateProduct) {
    const exists = await this.productRepo.findById(id);
    if (!exists) throw new ApiError("Product not found", 404);
    const product = await this.productRepo.findByIdAndUpdate(id, data);
    return { product };
  }
  async delete(id: string) {
    const exists = await this.productRepo.findById(id);
    if (!exists) throw new ApiError("Product not found", 404);
    const product = await this.productRepo.findByIdAndDelete(id);
    return { product };
  }
  async findById(id: string) {
    const exists = await this.productRepo.findById(id);
    if (!exists) throw new ApiError("Product not found", 404);
    const product = await this.productRepo.findById(id);
    return { product };
  }
  async findAll(query: QueryString) {
    const products = await this.productRepo.findAll(query);
    return { products };
  }
}

export const productService = new ProductService(productRepo);
