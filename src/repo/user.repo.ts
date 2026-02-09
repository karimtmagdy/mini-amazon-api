import { User } from "../models/user.model";
// import type { UserDto } from "../contract/user.dto";
import { DEFAULT_USER_IMAGE } from "../contract/global.dto";
// import { CreateUser } from "../schemas/user.schema";

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
  async findAll() {
    return await User.find({}).select("+password").exec();
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
        status: "archived",
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
      { status: "deactivated" },
      { new: true },
    );
  }
  async unlock(id: string) {
    return await User.findByIdAndUpdate(
      id,
      {
        status: "active",
        lockedUntil: null,
        failedLoginAttempts: 0,
      },
      { new: true },
    );
  }
  async deleteBulk(ids: string[]) {
    return await User.updateMany(
      { id: { $in: ids } },
      { status: "inactive", deletedAt: new Date() },
    );
  }
}
export const userRepo = new UserRepo();
// async findAll(query: { includeDeleted?: boolean; status?: string } = {}) {
//   // const apiFeature = new ApiFeature(User.find(), query);
//   // apiFeature.filter().sort().fields().search().pagination();
//   const filter: any = {};

//   if (query.status) {
//     filter.status = query.status;
//   } else if (!query.includeDeleted) {
//     filter.status = { $ne: "deleted" };
//     filter.deletedAt = { $exists: false };
//   }
//   return await User.find(filter)
//     .select(
//       "+presence +lockedUntil +failedLoginAttempts +createdBy +updatedBy +deletedBy",
//     )
//     .populate("createdBy updatedBy deletedBy", "username email name image")
//     .sort({ createdAt: -1 });
// }
