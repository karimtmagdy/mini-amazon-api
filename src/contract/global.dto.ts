import type { Router } from "express";

export type At = {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};
export type Image = {
  secureUrl: string;
  publicId: string | null;
};
export const DEFAULT_USER_IMAGE =
  "https://cdn-icons-png.flaticon.com/512/149/149071.png";

export interface GlobalResponse<T> {
  status: string;
  message?: string;
  data: T;
}
export type Route = {
  path: string;
  router: Router;
};
