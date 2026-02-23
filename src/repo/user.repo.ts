import { User } from "../models/user.model";
// import type { UserDto } from "../contract/user.dto";
import { DEFAULT_USER_IMAGE } from "../contract/global.dto";
import { QueryString } from "../schema/standred.schema";
import { APIFeatures } from "../class/api.feature";
import { UserAccountStatusEnum } from "../contract/user.dto";
// import { CreateUser } from "../schemas/user.schema";

/**
 * Design Pattern: Repository Pattern
 * Purpose: Abstracts user data access and provides CRUD operations for User entities.
 * Responsibilities: Database queries, user creation/updates, soft deletion, and bulk operations.
 */
export class UserRepo {
  async findByEmail(email: string) {
    return await User.findOne({ email }).select(
      "+password +failedLoginAttempts +lockedUntil +resetOtp.code +resetOtp.expiresAt",
    );
  }
  async findById(id: string) {
    return await User.findById(id);
  }
  async findAll(query: QueryString) {
    const features = new APIFeatures(User, query);
    const users = await features
      .filter()
      .sort()
      .limitFields()
      .paginate()
      .search(["username", "email"])
      .execute();
    return users;
  }
  async create(user: any) {
    return await User.create(user);
  }
  async update(id: string, user: any) {
    return await User.findByIdAndUpdate(id, user, {
      new: true,
      runValidators: true,
    });
  }
  async softDelete(id: string) {
    return await User.findByIdAndUpdate(
      id,
      {
        status: UserAccountStatusEnum.ARCHIVED,
        deletedAt: new Date(),
        image: {
          secureUrl: DEFAULT_USER_IMAGE,
          publicId: null,
        },
      },
      { new: true },
    );
  }
  async changeRole(id: string, role: string) {
    return await User.findByIdAndUpdate(
      id,
      { role },
      { new: true, runValidators: true },
    );
  }
  async updateStatus(id: string, status: string) {
    return await User.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true },
    );
  }
  async deactivate(id: string) {
    return await User.findByIdAndUpdate(
      id,
      { status: UserAccountStatusEnum.DEACTIVATED },
      { new: true },
    );
  }
  async reactivate(id: string) {
    return await User.findByIdAndUpdate(
      id,
      { status: UserAccountStatusEnum.ACTIVE },
      { new: true },
    );
  }
  async unlock(id: string) {
    return await User.findByIdAndUpdate(
      id,
      {
        status: UserAccountStatusEnum.ACTIVE,
        lockedUntil: null,
        failedLoginAttempts: 0,
      },
      { new: true },
    );
  }
  async deleteBulk(ids: string[]) {
    return await User.updateMany(
      { id: { $in: ids } },
      { status: UserAccountStatusEnum.ARCHIVED, deletedAt: new Date() },
    );
  }
}
export const userRepo = new UserRepo();
 