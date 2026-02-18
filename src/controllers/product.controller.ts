import { catchError } from "../lib/catch.error";
import { QueryString } from "../schema/standred.schema";
import { ProductService, productService } from "../services/product.service";
import { Request, Response } from "express";

export class ProductController {
  constructor(private readonly productService: ProductService) {}
  create = catchError(async (req: Request, res: Response) => {
    const { product } = await this.productService.create(req.body);
    res.status(201).json({ product });
  });
  update = catchError(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const { product } = await this.productService.update(id, req.body);
    res.status(200).json({ product });
  });
  delete = catchError(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const { product } = await this.productService.delete(id);
    res.status(200).json({ product });
  });
  getOne = catchError(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const { product } = await this.productService.findById(id);
    res.status(200).json({ product });
  });
  getAll = catchError(async (req: Request, res: Response) => {
    const queryData = req.query as unknown as QueryString;
    const { products } = await this.productService.findAll(queryData);
    res.status(200).json({ products });
  });
}
export const productController = new ProductController(productService);
