import { Request, Response } from "express";
import { catchError } from "../lib/catch.error";
import { BrandService, brandService } from "../services/brand.service";
import { CreateBrand, UpdateBrand } from "../schemas/brand.schema";
import { GlobalResponse, QueryString } from "../schemas/standred.schema";
import { BrandDto } from "../contract/brand.dto";

export class BrandController {
  constructor(protected brandService: BrandService) {}
  create = catchError(async (req: Request, res: Response) => {
    const validateData = req.body as CreateBrand;
    const { brand } = await this.brandService.create(validateData, req.file);
    res.status(201).json({
      status: "success",
      message: "brand has been created",
      data: brand,
    } satisfies GlobalResponse<BrandDto>);
  });
  softDelete = catchError(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const { brand } = await this.brandService.softDelete(id);
    res.status(200).json({
      status: "success",
      message: "brand has been moved to trash",
      data: brand,
    } satisfies GlobalResponse<BrandDto>);
  });
  update = catchError(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const validateData = req.body as UpdateBrand;
    const { brand } = await this.brandService.update(
      id,
      validateData,
      req.file,
    );
    res.status(200).json({
      status: "success",
      message: "brand has been updated",
      data: brand,
    } satisfies GlobalResponse<BrandDto>);
  });
  getOne = catchError(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const { brand } = await this.brandService.findById(id);
    res.status(200).json({
      status: "success",
      data: brand,
    } satisfies GlobalResponse<BrandDto>);
  });
  getAll = catchError(async (req: Request, res: Response) => {
    const queryData = req.query as unknown as QueryString;
    const { brands } = await this.brandService.findAll(queryData);
    res.status(200).json({
      status: "success",
      meta: brands.pagination,
      data: brands.data,
    } satisfies GlobalResponse<BrandDto[]>);
  });
}

export const brandController = new BrandController(brandService);
