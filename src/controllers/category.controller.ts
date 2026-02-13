import { Request, Response } from "express";
import { catchError } from "../lib/catch.error";
import { CategoryService, categoryService } from "../services/category.service";
import { CreateCategory, UpdateCategory } from "../schemas/category.schema";
import { GlobalResponse } from "../schemas/standred.schema";
import { CategoryDto } from "../contract/category.dto";

export class CategoryController {
  constructor(protected categoryService: CategoryService) {}
  create = catchError(async (req: Request, res: Response) => {
    const validateData = req.body as CreateCategory;
    const { category } = await this.categoryService.create(validateData);
    res.status(201).json({
      status: "success",
      data: category,
      message: "Category created successfully",
    } satisfies GlobalResponse<CategoryDto>);
  });
  softDelete = catchError(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const { category } = await this.categoryService.softDelete(id);
    res.status(200).json({
      status: "success",
      data: category,
      message: "Category deleted successfully",
    } satisfies GlobalResponse<CategoryDto>);
  });

  update = catchError(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const validateData = req.body as UpdateCategory;
    const { category } = await this.categoryService.update(id, validateData);
    res.status(200).json({
      status: "success",
      data: category,
      message: "Category updated successfully",
    } satisfies GlobalResponse<CategoryDto>);
  });
  getOne = catchError(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const { category } = await this.categoryService.findById(id);
    res.status(200).json({
      status: "success",
      data: category,
      message: "Category fetched successfully",
    } satisfies GlobalResponse<CategoryDto>);
  });
  getAll = catchError(async (req: Request, res: Response) => {
    const { categories } = await this.categoryService.findAll();
    res.status(200).json({
      status: "success",
      data: categories,
      message: "Categories fetched successfully",
    } satisfies GlobalResponse<CategoryDto[]>);
  });
}

export const categoryController = new CategoryController(categoryService);
