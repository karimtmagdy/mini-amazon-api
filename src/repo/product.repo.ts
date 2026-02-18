import { APIFeatures } from "../class/api.feature";
import { Product } from "../models/product.model";
import { CreateProduct } from "../schema/product.schema";
import { QueryString } from "../schema/standred.schema";

export class ProductRepo {
  async create(data: CreateProduct) {
    const product = await Product.create(data);
    return product;
  }

  async findById(id: string) {
    const product = await Product.findById(id);
    return product;
  }

  async findByIdAndUpdate(id: string, data: CreateProduct) {
    const product = await Product.findByIdAndUpdate(id, data, { new: true });
    return product;
  }

  async findByIdAndDelete(id: string) {
    const product = await Product.findByIdAndDelete(id);
    return product;
  }

  async findAll(query: QueryString) {
    const features = new APIFeatures(Product, query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const products = await features
      .filter()
      .populate({ path: "category", select: "name" })
      .populate("products")
      .sort()
      .limitFields()
      .paginate()
      .search(["name"])
      .execute();
    return products;
  }
}
export const productRepo = new ProductRepo();