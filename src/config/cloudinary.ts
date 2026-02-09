import { v2 as cloudinary } from "cloudinary";

import { env } from "../lib/env";
import { logger } from "../lib/logger";

cloudinary.config({
  cloud_name: env.cloudinaryApiCloudName!,
  api_key: env.cloudinaryApiKey!,
  api_secret: env.cloudinaryApiSecretKey!,
});

export class CloudinaryService {
  async uploadSinglePhoto(filePath: string, folder: string = "uploads") {
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder,
        resource_type: "auto",
      });
      return result;
    } catch (error) {
      logger.error("Cloudinary Upload Error:", error);
      throw error;
    }
  }

  async uploadMultiplePhotos(filePaths: string[], folder: string = "uploads") {
    try {
      if (!filePaths || filePaths.length === 0) return [];
      const uploadPromises = filePaths.map((path) =>
        this.uploadSinglePhoto(path, folder),
      );
      return await Promise.all(uploadPromises);
    } catch (error) {
      logger.error("Cloudinary Bulk Upload Error:", error);
      throw error;
    }
  }

  async deletePhoto(publicId: string) {
    try {
      if (!publicId) return;
      const result = await cloudinary.uploader.destroy(publicId);
      return result;
    } catch (error) {
      logger.error("Cloudinary Delete Error:", error);
      throw error;
    }
  }

  async deleteMultiplePhotos(publicIds: string[]) {
    try {
      if (!publicIds || publicIds.length === 0) return;
      const deletePromises = publicIds.map((id) =>
        cloudinary.uploader.destroy(id),
      );
      return await Promise.all(deletePromises);
    } catch (error) {
      logger.error("Cloudinary Bulk Delete Error:", error);
      throw error;
    }
  }
}
export const cloudService = new CloudinaryService();
