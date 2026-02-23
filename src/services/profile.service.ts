import { UserRepo, userRepo } from "../repo/user.repo";
import { UpdateUserProfile } from "../schema/user.schema";
import { cloudService } from "../config/cloudinary";
import fs from "fs";
import { ErrorFactory } from "../class/error.factory";
import { UserRoleEnum } from "../contract/user.dto";
/**
 * Design Pattern: Service Layer
 * Purpose: Handles user-related business logic and operations.
 * Responsibilities: User data retrieval, validation, and coordination with user repository.
 */
export class ProfileService {
  constructor(protected userRepo: UserRepo) {}
  async getHimself(userId: string) {
    const user = await this.userRepo.findById(userId);
    if (!user) ErrorFactory.throwNotFound("User not found");
    return { user };
  }
  async updateUserHimself(
    userId: string,
    data: Partial<UpdateUserProfile>,
    file?: Express.Multer.File,
  ) {
    if (file) {
      const { url, publicId } = await cloudService.uploadSinglePhoto(
        file.path,
        "users",
      );
      const currentUser = await this.userRepo.findById(userId);
      if (currentUser?.image?.publicId) {
        await cloudService.deletePhoto(currentUser.image.publicId);
      }
      data.image = { url, publicId };
      fs.unlinkSync(file.path);
    }
    const user = await this.userRepo.update(userId, data);
    if (!user) ErrorFactory.throwNotFound("User not found");
    return { user };
  }
  async deleteImage(userId: string) {
    const data = await this.userRepo.findById(userId);
    if (!data) ErrorFactory.throwNotFound("User not found");
    if (data?.image?.publicId) {
      await cloudService.deletePhoto(data.image.publicId);
    }
    const user = await this.userRepo.update(userId, { image: null });
    return { user };
  }
  async deactivateAccount(userId: string) {
    const data = await this.userRepo.findById(userId);
    if (!data) ErrorFactory.throwNotFound("User not found");
    if (data?.role === UserRoleEnum.ADMIN)
      ErrorFactory.throwBadRequest("You cannot deactivate yourself");
    const user = await this.userRepo.deactivate(userId);
    return { user };
  }
  async deleteHimself(userId: string) {
    const data = await this.userRepo.findById(userId);
    if (!data) ErrorFactory.throwNotFound("User not found");
    if (data?.role === UserRoleEnum.ADMIN)
      ErrorFactory.throwBadRequest("You cannot delete yourself");
    const user = await this.userRepo.softDelete(userId);
    return { user };
  }
}

export const profileService = new ProfileService(userRepo);
