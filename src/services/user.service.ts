// import { UserDto } from "../contract/user.dto";
import { ApiError } from "../class/api.error";
import { UserRepo, userRepo } from "../repo/user.repo";
import { CreateUser, UpdateUser, UpdateUserProfile } from "../schemas/user.schema";
import { cloudService } from "../config/cloudinary";
import fs from "fs";
/**
 * Design Pattern: Service Layer
 * Purpose: Handles user-related business logic and operations.
 * Responsibilities: User data retrieval, validation, and coordination with user repository.
 */
export class UserService {
  constructor(protected userRepo: UserRepo) {}
  async getUserById(id: string) {
    const data = await this.userRepo.findById(id);
    if (!data) throw new ApiError("User not found", 404);
    return { data };
  }
  async createByAdmin(user: CreateUser) {
    const exists = await this.userRepo.findByEmail(user.email);
    if (exists) throw new ApiError("User already exists", 400);
    const data = await this.userRepo.create(user);
    return { data };
  }
  async getAll() {
    const data = await this.userRepo.findAll();
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

  async update(userId: string, user: UpdateUser) {
    const exists = await this.userRepo.findById(userId);
    if (!exists) throw new ApiError("User not found", 404);
    const data = await this.userRepo.update(userId, user);
    return { data };
  }

  // UPDATE
  async changeRole(id: string, role: string) {
    const user = await this.userRepo.findById(id);
    if (!user) throw new ApiError("User not found", 404);
    if (user.role === "admin")
      throw new ApiError("You cannot change admin role", 400);
    const data = await this.userRepo.changeRole(id, role);
    return { data };
  }
  async updateStatus(id: string, status: string) {
    const user = await this.userRepo.findById(id);
    if (!user) throw new ApiError("User not found", 404);
    const data = await this.userRepo.updateStatus(id, status);
    return { data };
  }
  async unlockByAdmin(userId: string) {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new ApiError("User not found", 404);
    const data = await this.userRepo.unlock(userId);
    return { data };
  }
  async deactivateByAdmin(userId: string) {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new ApiError("User not found", 404);
    if (user.role === "admin")
      throw new ApiError("You cannot deactivate admin", 400);
    if (userId === user.id)
      throw new ApiError("You cannot deactivate yourself", 400);
    const data = await this.userRepo.deactivate(userId);
    return { data };
  }
  // DELETE
  async deleteHimself(userId: string) {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new ApiError("User not found", 404);
    const data = await this.userRepo.softDelete(userId);
    return { data };
  }
  async softDeleteByAdmin(id: string) {
    const user = await this.userRepo.findById(id);
    if (!user) throw new ApiError("User not found", 404);
    if (user.role === "admin")
      throw new ApiError(
        "Administrators cannot delete their own accounts",
        400,
      );
    // if (id === user.id) throw new ApiError("You cannot delete yourself", 400);
    const data = await this.userRepo.softDelete(id);
    return { data };
  }
  async deleteBulk(userIds: string[]) {
    if (userIds.length === 0) throw new ApiError("No users found", 404);
    const data = await this.userRepo.deleteBulk(userIds);
    return { data };
  }
}

export const userService = new UserService(userRepo);
