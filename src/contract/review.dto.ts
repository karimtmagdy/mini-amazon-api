import { At } from "./global.dto";

export const REVIEW_STATUS = ["pending", "completed", "failed"] as const;
export type ReviewStatus = (typeof REVIEW_STATUS)[number];

export type ReviewDto = At & {
  comment: string;
  ratings: number;
//   user: Types.ObjectId;
//   product: Types.ObjectId;
};
export type CreateReviewInput = {
  comment: string;
  ratings: number;
  user: string;
  product: string;
};

export type UpdateReviewInput = {
  comment?: string;
  ratings?: number;
};
