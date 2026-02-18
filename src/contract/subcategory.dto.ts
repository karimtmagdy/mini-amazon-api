import { Types } from "mongoose";
import { At } from "./global.dto";

export type SubCategoryDto = At & {
  name: string;
  slug: string;
  description?: string;
  category: (Types.ObjectId | string)[];
  products: number;
};
