// import { UserDto } from "../contract/user.dto";
import { ApiError } from "../class/api.error";
import { UserRepo, userRepo } from "../repo/user.repo";
import {
  CreateUser,
  UpdateUser,
  UpdateUserProfile,
} from "../schemas/user.schema";
import { cloudService } from "../config/cloudinary";
import fs from "fs";
/**
 * Design Pattern: Service Layer
 * Purpose: Handles user-related business logic and operations.
 * Responsibilities: User data retrieval, validation, and coordination with user repository.
 */
export class ProfileService {
  constructor(protected userRepo: UserRepo) {}
  async getHimself(userId: string) {
    const data = await this.userRepo.findById(userId);
    if (!data) throw new ApiError("User not found", 404);
    return { data };
  }
  async updateUserHimself(
    userId: string,
    user: Partial<UpdateUserProfile>,
    file?: Express.Multer.File,
  ) {
    if (file) {
      const { secureUrl, publicId } = await cloudService.uploadSinglePhoto(
        file.path,
        "users",
      );
      const currentUser = await this.userRepo.findById(userId);
      if (currentUser?.image?.publicId) {
        await cloudService.deletePhoto(currentUser.image.publicId);
      }
      user.image = { secureUrl, publicId };
      fs.unlinkSync(file.path);
    }
    const data = await this.userRepo.update(userId, user);
    if (!data) throw new ApiError("User not found", 404);
    return { data };
  }
    async deleteImage(userId: string) {
      const user = await this.userRepo.findById(userId);
      if (!user) throw new ApiError("User not found", 404);
      if (user.image?.publicId) {
        await cloudService.deletePhoto(user.image.publicId);
      }
      const data = await this.userRepo.update(userId, { image: null });
      return { data };
    }
  async deactivateAccount(userId: string) {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new ApiError("User not found", 404);
    if (user.role === "admin")
      throw new ApiError("You cannot deactivate yourself", 400);
    const data = await this.userRepo.deactivate(userId);
    return { data };
  }
  async deleteHimself(userId: string) {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new ApiError("User not found", 404);
    if (user.role === "admin")
      throw new ApiError("You cannot delete yourself", 400);
    const data = await this.userRepo.softDelete(userId);
    return { data };
  }
}

export const profileService = new ProfileService(userRepo);
