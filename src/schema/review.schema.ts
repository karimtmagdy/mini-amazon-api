import { z } from "zod/v4";
import { mongoIdRegex } from "./standred.schema";
export const defaultReviewZod = z.object({
  body: z.object({
    comment: z
      .string({ message: "Comment must be a string" })
      .min(3, "Comment is too short"),
    ratings: z
      .number({ message: "Rating must be a number" })
      .min(1, { error: "Rating must be at least 1" })
      .max(5, { error: "Rating must be at most 5" }),
  }),
  params: z.object({
    productId: z.string().regex(mongoIdRegex, "Invalid product ID"),
  }),
});
const createReviewZod = defaultReviewZod.shape.body.pick({
  comment: true,
  ratings: true,
});
// export const updateReviewZod = defaultReviewZod.shape;
export const updateReviewSchema = z.object({
  body: z.object({
    comment: z.string().min(3, "Comment is too short").optional(),
    ratings: z.number().min(1).max(5).optional(),
  }),
  params: z.object({
    id: z.string().regex(mongoIdRegex, "Invalid review ID"),
  }),
});

export const getReviewsSchema = z.object({
  query: z.object({
    page: z.string().optional().default("1"),
    limit: z.string().optional().default("10"),
    ratings: z.string().optional(),
    sortBy: z.enum(["ratings", "createdAt"]).optional().default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
  }),
});

export const getSingleReviewSchema = z.object({
  params: z.object({
    id: z.string().regex(mongoIdRegex, "Invalid review ID"),
  }),
});

export const getProductReviewSchema = z.object({
  params: z.object({
    productId: z.string().regex(mongoIdRegex, "Invalid product ID"),
    reviewId: z.string().regex(mongoIdRegex, "Invalid review ID").optional(),
  }),
});

export type CreateReview = z.infer<typeof createReviewZod>;
export type UpdateReviewInputSchema = z.infer<
  typeof updateReviewSchema
>["body"];
