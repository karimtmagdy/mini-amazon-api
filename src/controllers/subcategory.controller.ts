import { Request, Response } from "express";
import { catchError } from "../lib/catch.error";
import {
  SubCategoryService,
  subCategoryService,
} from "../services/subcategory.service";
import {
  CreateSubCategory,
  UpdateSubCategory,
} from "../schema/subcategory.schema";
import {
  QueryString,
  ResponseWithMeta,
  ResponseZod,
} from "../schema/standred.schema";
import { SubCategoryDto } from "../contract/subcategory.dto";

export class SubCategoryController {
  constructor(protected subCategoryService: SubCategoryService) {}
  create = catchError(async (req: Request, res: Response) => {
    const validateData = req.body as CreateSubCategory;
    const { subCategory } = await this.subCategoryService.create(validateData);
    res.status(201).json({
      status: "success",
      message: "subCategory has been created",
      data: subCategory,
    } satisfies ResponseZod<SubCategoryDto>);
  });
  delete = catchError(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const { subCategory } = await this.subCategoryService.delete(id);
    res.status(200).json({
      status: "success",
      message: "subCategory has been deleted",
      data: subCategory,
    } satisfies ResponseZod<SubCategoryDto>);
  });
  update = catchError(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const validateData = req.body as UpdateSubCategory;
    const { subCategory } = await this.subCategoryService.update(
      id,
      validateData,
    );
    res.status(200).json({
      status: "success",
      message: "subCategory has been updated",
      data: subCategory,
    } satisfies ResponseZod<SubCategoryDto>);
  });
  getOne = catchError(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const { subCategory } = await this.subCategoryService.findById(id);
    res.status(200).json({
      status: "success",
      data: subCategory,
    } satisfies ResponseZod<SubCategoryDto>);
  });
  getAll = catchError(async (req: Request, res: Response) => {
    const queryData = req.query as unknown as QueryString;
    const { subCategories } = await this.subCategoryService.findAll(queryData);
    res.status(200).json({
      status: "success",
      meta: subCategories.pagination,
      data: subCategories.data,
    } satisfies ResponseWithMeta<SubCategoryDto[]>);
  });
}

export const subCategoryController = new SubCategoryController(
  subCategoryService,
);
