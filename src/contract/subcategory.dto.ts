import {  Types } from "mongoose";

export type SubCategoryDto = {
  name: string;
  slug: string;
  description?: string;
  category: (Types.ObjectId | string)[];
  productsCount: number;
  deletedAt?: Date | null;
}
