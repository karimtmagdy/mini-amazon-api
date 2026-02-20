import { ApiError } from "../class/api.error";
import { cloudService } from "../config/cloudinary";
import { BrandDto } from "../contract/brand.dto";
import { CreateBrand, UpdateBrand } from "../schema/brand.schema";
import { BrandRepo, brandRepo } from "../repo/brand.repo";
import { QueryString } from "../schema/standred.schema";
import fs from "fs";

export class BrandService {
  constructor(private readonly brandRepo: BrandRepo) {}

  async create(data: CreateBrand, file?: Express.Multer.File) {
    const nameExists = await this.brandRepo.findByName(data.name);
    if (nameExists) {
      throw new ApiError("Brand name already exists", 400);
    }

    if (file) {
      const { url, publicId } = await cloudService.uploadSinglePhoto(
        file.path,
        "brands",
      );
      fs.unlinkSync(file.path);
      data.image = { url, publicId };
    }
    const brand = await this.brandRepo.create(data as any);
    return { brand };
  }
  async update(id: string, data: UpdateBrand, file?: Express.Multer.File) {
    const exists = await this.brandRepo.findById(id);
    if (!exists) throw new ApiError("Brand not found", 404);

    if (data.name) {
      const nameExists = await this.brandRepo.findByName(data.name);
      if (nameExists && nameExists._id.toString() !== id.toString()) {
        throw new ApiError("Brand name already exists", 400);
      }
    }

    let image = exists.image;
    if (file) {
      const { url, publicId } = await cloudService.uploadSinglePhoto(
        file.path,
        "brands",
      );
      fs.unlinkSync(file.path);
      image = { url, publicId };
      if (exists.image?.publicId) {
        await cloudService.deletePhoto(exists.image.publicId);
      }
    }
    const updateData: Partial<BrandDto> = {
      ...data,
      image,
    };
    const brand = await this.brandRepo.update(id, updateData as any);
    if (!brand) throw new ApiError("Brand not found", 404);
    return { brand };
  }
  async softDelete(id: string) {
    const brand = await this.brandRepo.softDelete(id);
    if (!brand) throw new ApiError("Brand not found", 404);
    return { brand };
  }
  async findById(id: string) {
    const brand = await this.brandRepo.findById(id);
    if (!brand) throw new ApiError("Brand not found", 404);
    return { brand };
  }
  async findAll(query: QueryString) {
    const brands = await this.brandRepo.findAll(query);
    return { brands };
  }
}
export const brandService = new BrandService(brandRepo);
