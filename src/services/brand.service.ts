import { cloudService } from "../config/cloudinary";
import { BrandDto } from "../contract/brand.dto";
import { CreateBrand, UpdateBrand } from "../schema/brand.schema";
import { BrandRepo, brandRepo } from "../repo/brand.repo";
import { QueryString } from "../schema/standred.schema";
import fs from "fs";
import { ErrorFactory } from "../class/error.factory";

export class BrandService {
  constructor(private readonly brandRepo: BrandRepo) {}

  async create(data: CreateBrand, file?: Express.Multer.File) {
    const exists = await this.brandRepo.findByName(data.name);
    if (exists) {
      ErrorFactory.throwBadRequest("Brand name already exists");
    }

    // Build the full payload — image comes from req.file (Multer), not from req.body
    const createData: Record<string, any> = { ...data };
    if (file) {
      const { url, publicId } = await cloudService.uploadSinglePhoto(
        file.path,
        "brands",
      );
      fs.unlinkSync(file.path);
      createData.image = { url, publicId };
    }
    const brand = await this.brandRepo.create(createData as any);
    return { brand };
  }
  async update(brandId: string, data: UpdateBrand, file?: Express.Multer.File) {
    const exists = await this.brandRepo.findById(brandId);
    if (!exists) ErrorFactory.throwNotFound("Brand not found");

    if (data.name) {
      const exists = await this.brandRepo.findByName(data.name);
      if (exists && exists._id.toString() !== brandId.toString()) {
        ErrorFactory.throwBadRequest("Brand name already exists");
      }
    }

    // Build the full update payload — image comes from req.file (Multer), not from req.body
    let image = exists?.image;
    if (file) {
      const { url, publicId } = await cloudService.uploadSinglePhoto(
        file.path,
        "brands",
      );
      fs.unlinkSync(file.path);
      image = { url, publicId };
      if (exists?.image?.publicId) {
        await cloudService.deletePhoto(exists.image.publicId);
      }
    }
    const updateData: Partial<BrandDto> = {
      ...data,
      ...(image ? { image } : {}),
    };
    const brand = await this.brandRepo.update(brandId, updateData as any);
    if (!brand) ErrorFactory.throwNotFound("Brand not found");
    return { brand };
  }
  async softDelete(brandId: string) {
    const brand = await this.brandRepo.softDelete(brandId);
    if (!brand) ErrorFactory.throwNotFound("Brand not found");
    return { brand };
  }
  async findById(brandId: string) {
    const brand = await this.brandRepo.findById(brandId);
    if (!brand) ErrorFactory.throwNotFound("Brand not found");
    return { brand };
  }
  async findAll(query: QueryString) {
    const brands = await this.brandRepo.findAll(query);
    return { brands };
  }
}
export const brandService = new BrandService(brandRepo);
