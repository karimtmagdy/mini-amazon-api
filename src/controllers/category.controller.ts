import { Request, Response } from "express";
import { catchError } from "../lib/catch.error";
import { CategoryService, categoryService } from "../services/category.service";
import { CreateCategory, UpdateCategory } from "../schemas/category.schema";
import { GlobalResponse, QueryString } from "../schemas/standred.schema";
import { CategoryDto } from "../contract/category.dto";

export class CategoryController {
  constructor(protected categoryService: CategoryService) {}
  create = catchError(async (req: Request, res: Response) => {
    const validateData = req.body as CreateCategory;
    const { category } = await this.categoryService.create(
      validateData,
      req.file,
    );
    res.status(201).json({
      status: "success",
      message: "category has been created",
      data: category,
    } satisfies GlobalResponse<CategoryDto>);
  });
  softDelete = catchError(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const { category } = await this.categoryService.softDelete(id);
    res.status(200).json({
      status: "success",
      message: "category has been moved to trash",
      data: category,
    } satisfies GlobalResponse<CategoryDto>);
  });
  update = catchError(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const validateData = req.body as UpdateCategory;
    const { category } = await this.categoryService.update(
      id,
      validateData,
      req.file,
    );
    res.status(200).json({
      status: "success",
      message: "category has been updated",
      data: category,
    } satisfies GlobalResponse<CategoryDto>);
  });
  getOne = catchError(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const { category } = await this.categoryService.findById(id);
    res.status(200).json({
      status: "success",
      data: category,
    } satisfies GlobalResponse<CategoryDto>);
  });
  getAll = catchError(async (req: Request, res: Response) => {
    const queryData = req.query as unknown as QueryString;
    const { categories } = await this.categoryService.findAll(queryData);
    res.status(200).json({
      status: "success",
      data: categories.data,
      meta: categories.pagination,
    } satisfies GlobalResponse<CategoryDto[]>);
  });
}

export const categoryController = new CategoryController(categoryService);
