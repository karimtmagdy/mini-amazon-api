import { ApiError } from "../class/api.error";
import { UserRepo, userRepo } from "../repo/user.repo";

/**
 * Design Pattern: Service Layer
 * Purpose: Handles user-related business logic and operations.
 * Responsibilities: User data retrieval, validation, and coordination with user repository.
 */
export class UserService {
  constructor(protected userRepo: UserRepo) {}
  async getUserHimself(userId: string) {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new ApiError("User not found", 404);
    return { user };
  }
}

export const userService = new UserService(userRepo);
