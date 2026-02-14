import { ApiError } from "../class/api.error";
import { UserRepo, userRepo } from "../repo/user.repo";
import { QueryString } from "../schemas/standred.schema";
import { CreateUser, UpdateUser } from "../schemas/user.schema";
// import { cloudService } from "../config/cloudinary";
// import fs from "fs";
/**
 * Design Pattern: Service Layer
 * Purpose: Handles user-related business logic and operations.
 * Responsibilities: User data retrieval, validation, and coordination with user repository.
 */
export class UserService {
  constructor(protected userRepo: UserRepo) {}
  async getUserById(id: string) {
    const user = await this.userRepo.findById(id);
    if (!user) throw new ApiError("User not found", 404);
    return { user };
  }
  async createByAdmin(data: CreateUser) {
    const exists = await this.userRepo.findByEmail(data.email);
    if (exists) throw new ApiError("User already exists", 400);
    const user = await this.userRepo.create(data);
    return { user };
  }
  async getAll(query: QueryString) {
    const users = await this.userRepo.findAll(query);
    return { users };
  }
  async update(userId: string, data: UpdateUser) {
    const exists = await this.userRepo.findById(userId);
    if (!exists) throw new ApiError("User not found", 404);
    const user = await this.userRepo.update(userId, data);
    return { user };
  }
  async changeRole(id: string, role: string) {
    const data = await this.userRepo.findById(id);
    if (!data) throw new ApiError("User not found", 404);
    if (data.role === "admin")
      throw new ApiError("You cannot change admin role", 400);
    const user = await this.userRepo.changeRole(id, role);
    return { user };
  }
  async updateStatus(id: string, status: string) {
    const data = await this.userRepo.findById(id);
    if (!data) throw new ApiError("User not found", 404);
    const user = await this.userRepo.updateStatus(id, status);
    return { user };
  }
  async unlockByAdmin(userId: string) {
    const data = await this.userRepo.findById(userId);
    if (!data) throw new ApiError("User not found", 404);
    const user = await this.userRepo.unlock(userId);
    return { user };
  }
  async deactivateByAdmin(userId: string) {
    const data = await this.userRepo.findById(userId);
    if (!data) throw new ApiError("User not found", 404);
    if (data.role === "admin")
      throw new ApiError("You cannot deactivate admin", 400);
    if (userId === data.id)
      throw new ApiError("You cannot deactivate yourself", 400);
    const user = await this.userRepo.deactivate(userId);
    return { user };
  }
  // async reactivateByAdmin(userId: string) {
  //   const user = await this.userRepo.findById(userId);
  //   if (!user) throw new ApiError("User not found", 404);
  //   const data = await this.userRepo.reactivate(userId);
  //   return { data };
  // }
  async softDeleteByAdmin(id: string) {
    const data = await this.userRepo.findById(id);
    if (!data) throw new ApiError("User not found", 404);
    if (data.role === "admin")
      throw new ApiError(
        "Administrators cannot delete their own accounts",
        400,
      );
    // if (id === user.id) throw new ApiError("You cannot delete yourself", 400);
    const user = await this.userRepo.softDelete(id);
    return { user };
  }
  async deleteBulk(userIds: string[]) {
    if (userIds.length === 0) throw new ApiError("No users found", 404);
    const users = await this.userRepo.deleteBulk(userIds);
    return { users };
  }
}

export const userService = new UserService(userRepo);
