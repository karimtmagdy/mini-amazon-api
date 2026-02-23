import { UserRepo, userRepo } from "../repo/user.repo";
import { QueryString } from "../schema/standred.schema";
import { CreateUser, UpdateUser } from "../schema/user.schema";
// import { cloudService } from "../config/cloudinary";
// import fs from "fs";
import { UserRoleEnum } from "../contract/user.dto";
import { ErrorFactory } from "../class/error.factory";
/**
 * Design Pattern: Service Layer
 * Purpose: Handles user-related business logic and operations.
 * Responsibilities: User data retrieval, validation, and coordination with user repository.
 */
export class UserService {
  constructor(protected userRepo: UserRepo) {}
  async getUserById(userId: string) {
    const user = await this.userRepo.findById(userId);
    if (!user) ErrorFactory.throwNotFound("User not found");
    return { user };
  }
  async createByAdmin(data: CreateUser) {
    const exists = await this.userRepo.findByEmail(data.email);
    if (exists) ErrorFactory.throwBadRequest("User already exists");
    const user = await this.userRepo.create(data);
    return { user };
  }
  async getAll(query: QueryString) {
    const users = await this.userRepo.findAll(query);
    return { users };
  }
  async update(userId: string, data: UpdateUser) {
    const exists = await this.userRepo.findById(userId);
    if (!exists) ErrorFactory.throwNotFound("User not found");
    const user = await this.userRepo.update(userId, data);
    return { user };
  }
  async changeRole(userId: string, role: string) {
    const data = await this.userRepo.findById(userId);
    if (!data) ErrorFactory.throwNotFound("User not found");
    if (data?.role === UserRoleEnum.ADMIN)
      ErrorFactory.throwBadRequest("You cannot change admin role");
    const user = await this.userRepo.changeRole(userId, role);
    return { user };
  }
  async updateStatusByAdmin(userId: string, status: string) {
    const data = await this.userRepo.findById(userId);
    if (!data) ErrorFactory.throwNotFound("User not found");
    if (data?.role === UserRoleEnum.ADMIN)
      ErrorFactory.throwBadRequest("You cannot change admin status");
    const user = await this.userRepo.updateStatus(userId, status);
    return { user };
  }
  async unlockByAdmin(userId: string) {
    const data = await this.userRepo.findById(userId);
    if (!data) ErrorFactory.throwNotFound("User not found");
    const user = await this.userRepo.unlock(userId);
    return { user };
  }
  async deactivateByAdmin(userId: string) {
    const data = await this.userRepo.findById(userId);
    if (!data) ErrorFactory.throwNotFound("User not found");
    if (data?.role === UserRoleEnum.ADMIN)
      ErrorFactory.throwBadRequest("You cannot deactivate admin");
    if (userId === data?.id)
      ErrorFactory.throwBadRequest("You cannot deactivate yourself");
    const user = await this.userRepo.deactivate(userId);
    return { user };
  }
  async reactivateByAdmin(userId: string) {
    const data = await this.userRepo.findById(userId);
    if (!data) ErrorFactory.throwNotFound("User not found");
    const user = await this.userRepo.reactivate(userId);
    return { user };
  }
  async softDeleteByAdmin(userId: string) {
    const data = await this.userRepo.findById(userId);
    if (!data) ErrorFactory.throwNotFound("User not found");
    if (data?.role === UserRoleEnum.ADMIN)
      ErrorFactory.throwBadRequest(
        "Administrators cannot delete their own accounts",
      );
    if (userId === data?.id)
      ErrorFactory.throwBadRequest("You cannot delete yourself");
    const user = await this.userRepo.softDelete(userId);
    return { user };
  }
  async deleteBulk(userIds: string[]) {
    if (userIds.length === 0) ErrorFactory.throwNotFound("No users found");
    const users = await this.userRepo.deleteBulk(userIds);
    return { users };
  }
}

export const userService = new UserService(userRepo);
// async updateStatusByAdmin(
//     userId: string,
//     adminId: string,
//     user: UpdateStatus,
//   ) {
//     if (!userId) throw new ApiError("User not found", 404);
//     // Use specialized methods for side-effects
//     if (user.status === "deactivated")
//       return this.deactivateUserByAdmin(userId, adminId);
//     if (user.status === "deleted")
//       return this.deletionService.deleteUserByAdmin(userId, adminId);
//     if (user.status === "active")
//       return this.reactivateUserByAdmin(userId, adminId);
//     // Prevent admin from changing their own status to restrictive states via generic update
//     const restrictiveStatuses: string[] = [
//       "locked",
//       "banned",
//       "deactivated",
//       "deleted",
//       "inactive",
//     ];
//     if (adminId === userId && restrictiveStatuses.includes(user.status)) {
//       throw new ApiError(
//         `You cannot change your own status to ${user.status}`,
//         400,
//       );
//     }
//     const data = await this.userRepository.updateStatus(
//       userId,
//       user.status,
//       adminId,
//     );
//     return { data };
//   }
