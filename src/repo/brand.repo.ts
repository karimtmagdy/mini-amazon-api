import { Brand } from "../models/brand.model";
import { BrandDto, BrandStatusEnum } from "../contract/brand.dto";
import { UpdateQuery } from "mongoose";
import { QueryString } from "../schema/standred.schema";
import { APIFeatures } from "../class/api.feature";

export class BrandRepo {
  async create(data: BrandDto) {
    const brand = await Brand.create(data);
    return brand;
  }
  async update(id: string, data: UpdateQuery<BrandDto>) {
    const brand = await Brand.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).lean();
    return brand;
  }
  async softDelete(id: string) {
    const brand = await Brand.findByIdAndUpdate(
      id,
      { status: BrandStatusEnum.ARCHIVED, deletedAt: new Date() },
      { new: true },
    );
    return brand;
  }
  async findById(id: string) {
    const brand = await Brand.findById(id).lean();
    return brand;
  }
  async findAll(query: QueryString) {
    const features = new APIFeatures(Brand, query);
    const brands = await features
      .filter()
      .sort()
      .limitFields()
      .paginate()
      .search(["name"])
      .execute();
    return brands;
  }
}

export const brandRepo = new BrandRepo();
