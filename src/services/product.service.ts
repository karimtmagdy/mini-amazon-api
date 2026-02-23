import { ProductRepo, productRepo } from "../repo/product.repo";
import { CreateProduct } from "../schema/product.schema";
import { QueryString } from "../schema/standred.schema";
import { ErrorFactory } from "../class/error.factory";

export class ProductService {
  constructor(private readonly productRepo: ProductRepo) {}
  async create(data: CreateProduct) {
    const exists = await this.productRepo.findById(data.name);
    if (exists) ErrorFactory.throwBadRequest("Product name already exists");
    const product = await this.productRepo.create(data);
    return { product };
  }
  async update(productId: string, data: CreateProduct) {
    const exists = await this.productRepo.findById(productId);
    if (!exists) ErrorFactory.throwNotFound("Product not found");
    const product = await this.productRepo.findByIdAndUpdate(productId, data);
    return { product };
  }
  async delete(productId: string) {
    const exists = await this.productRepo.findById(productId);
    if (!exists) ErrorFactory.throwNotFound("Product not found");
    const product = await this.productRepo.findByIdAndDelete(productId);
    return { product };
  }
  async findById(productId: string) {
    const exists = await this.productRepo.findById(productId);
    if (!exists) ErrorFactory.throwNotFound("Product not found");
    const product = await this.productRepo.findById(productId);
    return { product };
  }
  async findAll(query: QueryString) {
    const products = await this.productRepo.findAll(query);
    return { products };
  }
}

export const productService = new ProductService(productRepo);
