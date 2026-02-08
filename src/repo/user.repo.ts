import { User } from "../models/user.model";
import type { UserDto } from "../contract/user.dto";
import { DEFAULT_USER_IMAGE } from "../contract/global.dto";

/**
 * Design Pattern: Repository Pattern
 * Purpose: Abstracts user data access and provides CRUD operations for User entities.
 * Responsibilities: Database queries, user creation/updates, soft deletion, and bulk operations.
 */
export class UserRepo {
  async findByEmail(email: string) {
    return await User.findOne({ email }).select("+password");
  }
  async findByUsername(username: string) {
    return await User.findOne({ username });
  }
  async findById(id: string) {
    return await User.findById(id);
  }
  //   async findByRefreshToken(refreshToken: string) {
  //     return await Session.findOne({ refreshToken });
  //   }
  async create(user: UserDto) {
    return await User.create(user);
  }
  async update(user: UserDto) {
    return await User.findByIdAndUpdate(user.id, user, { new: true });
  }
  async softDelete(id: string) {
    return await User.findByIdAndUpdate(
      id,
      {
        status: "archived",
        deletedAt: new Date(),
        // refreshTokens: [],
        image: {
          secureUrl: DEFAULT_USER_IMAGE,
          publicId: null,
        },
      },
      { new: true },
    );
  }
  async deleteBulkUsers(ids: string[]) {
    return await User.updateMany(
      { id: { $in: ids } },
      { status: "inactive", deletedAt: new Date() },
    );
  }
}
export const userRepo = new UserRepo();
