// src/types/common.ts
import { z } from "zod";
import { Types } from "mongoose";

// Common ID validator
export const ObjectIdSchema = z
  .string()
  .refine((val) => Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId format",
  });

// Common timestamps interface
export interface ITimestamps {
  createdAt: Date;
  updatedAt: Date;
}

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

// Pagination params
export const PaginationSchema = z.object({
  page: z.string().optional().default("1").transform(Number),
  limit: z.string().optional().default("10").transform(Number),
  sortBy: z.string().optional(),
  order: z.enum(["asc", "desc"]).optional().default("desc"),
});

export type PaginationParams = z.infer<typeof PaginationSchema>; // src/types/user.types.ts
// import { z } from 'zod';
// import { Document } from 'mongoose';
// import { ITimestamps, ObjectIdSchema } from './common';

// Zod schemas for validation
export const UserCreateSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  role: z.enum(["user", "admin", "moderator"]).default("user"),
  isActive: z.boolean().default(true),
});

export const UserUpdateSchema = UserCreateSchema.partial()
  .omit({ password: true })
  .extend({
    password: z.string().min(8).optional(),
  });

export const UserParamsSchema = z.object({
  id: ObjectIdSchema,
});

export const UserQuerySchema = z
  .object({
    email: z.string().email().optional(),
    role: z.enum(["user", "admin", "moderator"]).optional(),
    isActive: z
      .enum(["true", "false"])
      .transform((v) => v === "true")
      .optional(),
    search: z.string().optional(),
  })
  .merge(PaginationSchema);

// TypeScript types derived from Zod
export type UserCreateInput = z.infer<typeof UserCreateSchema>;
export type UserUpdateInput = z.infer<typeof UserUpdateSchema>;
export type UserQueryParams = z.infer<typeof UserQuerySchema>;

// Mongoose Document interface
export interface IUser extends Document, ITimestamps {
  email: string;
  password: string;
  name: string;
  role: "user" | "admin" | "moderator";
  isActive: boolean;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// DTO for API responses (excludes sensitive data)
export interface UserDTO {
  id: string;
  email: string;
  name: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
} // src/models/user.model.ts
import mongoose, { Schema, Model } from "mongoose";
import bcrypt from "bcryptjs";
// import { IUser } from '../types/user.types';

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false, // Don't include password in queries by default
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    role: {
      type: String,
      enum: ["user", "admin", "moderator"],
      default: "user",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        return ret;
      },
    },
  },
);

// Indexes for performance
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1, isActive: 1 });
UserSchema.index({ name: "text", email: "text" });

// Pre-save middleware for password hashing
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Instance method for password comparison
UserSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema); // src/repositories/base.repository.ts
import {
  Model,
  Document,
  FilterQuery,
  UpdateQuery,
  QueryOptions,
} from "mongoose";
// import { PaginationParams } from '../types/common';

export abstract class BaseRepository<T extends Document> {
  constructor(protected readonly model: Model<T>) {}

  async create(data: Partial<T>): Promise<T> {
    const entity = new this.model(data);
    return entity.save();
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findById(id);
  }

  async findOne(filter: FilterQuery<T>): Promise<T | null> {
    return this.model.findOne(filter);
  }

  async find(
    filter: FilterQuery<T> = {},
    pagination: PaginationParams = { page: 1, limit: 10 },
  ): Promise<{ data: T[]; total: number }> {
    const { page, limit, sortBy, order } = pagination;
    const skip = (page - 1) * limit;

    const sortOptions: any = {};
    if (sortBy) {
      sortOptions[sortBy] = order === "asc" ? 1 : -1;
    } else {
      sortOptions.createdAt = -1;
    }

    const [data, total] = await Promise.all([
      this.model.find(filter).sort(sortOptions).skip(skip).limit(limit).exec(),
      this.model.countDocuments(filter),
    ]);

    return { data, total };
  }

  async update(id: string, data: UpdateQuery<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true },
    );
  }

  async delete(id: string): Promise<T | null> {
    return this.model.findByIdAndDelete(id);
  }

  async softDelete(id: string): Promise<T | null> {
    return this.model.findByIdAndUpdate(
      id,
      { $set: { isActive: false, deletedAt: new Date() } },
      { new: true },
    );
  }

  async exists(filter: FilterQuery<T>): Promise<boolean> {
    const count = await this.model.countDocuments(filter);
    return count > 0;
  }
} // src/repositories/user.repository.ts
// import { User } from '../models/user.model';
// import { IUser, UserQueryParams } from '../types/user.types';
// import { BaseRepository } from './base.repository';

export class UserRepository extends BaseRepository<IUser> {
  constructor() {
    super(User);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return this.model.findOne({ email }).select("+password");
  }

  async findWithQuery(params: UserQueryParams) {
    const { email, role, isActive, search, ...pagination } = params;

    const filter: any = {};

    if (email) filter.email = email;
    if (role) filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive;
    if (search) {
      filter.$text = { $search: search };
    }

    return this.find(filter, pagination);
  }

  async updatePassword(id: string, newPassword: string): Promise<IUser | null> {
    const user = await this.findById(id);
    if (!user) return null;

    user.password = newPassword;
    return user.save();
  }
}
// src/services/base.service.ts
// import { Document } from 'mongoose';
// import { BaseRepository } from '../repositories/base.repository';
// import { PaginationParams, ApiResponse } from '../types/common';

export abstract class BaseService<T extends Document, CreateDTO, UpdateDTO> {
  constructor(protected readonly repository: BaseRepository<T>) {}

  async create(data: CreateDTO): Promise<ApiResponse<T>> {
    try {
      const entity = await this.repository.create(data as Partial<T>);
      return {
        success: true,
        data: entity,
        message: "Created successfully",
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Creation failed",
      };
    }
  }

  async getById(id: string): Promise<ApiResponse<T>> {
    const entity = await this.repository.findById(id);
    if (!entity) {
      return {
        success: false,
        error: "Resource not found",
      };
    }
    return {
      success: true,
      data: entity,
    };
  }

  async getAll(pagination: PaginationParams): Promise<ApiResponse<T[]>> {
    const { data, total } = await this.repository.find({}, pagination);
    const { page, limit } = pagination;

    return {
      success: true,
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async update(id: string, data: UpdateDTO): Promise<ApiResponse<T>> {
    try {
      const entity = await this.repository.update(id, data as any);
      if (!entity) {
        return {
          success: false,
          error: "Resource not found",
        };
      }
      return {
        success: true,
        data: entity,
        message: "Updated successfully",
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Update failed",
      };
    }
  }

  async delete(id: string): Promise<ApiResponse<T>> {
    const entity = await this.repository.delete(id);
    if (!entity) {
      return {
        success: false,
        error: "Resource not found",
      };
    }
    return {
      success: true,
      message: "Deleted successfully",
    };
  }
} // src/services/user.service.ts
// import { UserRepository } from '../repositories/user.repository';
// import { BaseService } from './base.service';
// import {
//   IUser,
//   UserCreateInput,
//   UserUpdateInput,
//   UserQueryParams,
//   UserDTO
// } from '../types/user.types';
// import { ApiResponse } from '../types/common';

export class UserService extends BaseService<
  IUser,
  UserCreateInput,
  UserUpdateInput
> {
  private userRepo: UserRepository;

  constructor() {
    const repo = new UserRepository();
    super(repo);
    this.userRepo = repo;
  }

  async createUser(data: UserCreateInput): Promise<ApiResponse<UserDTO>> {
    // Check if email exists
    const exists = await this.userRepo.exists({ email: data.email });
    if (exists) {
      return {
        success: false,
        error: "Email already registered",
      };
    }

    const result = await super.create(data);
    if (!result.success) return result as ApiResponse<UserDTO>;

    return {
      success: true,
      data: this.toDTO(result.data!),
      message: "User created successfully",
    };
  }

  async getUserById(id: string): Promise<ApiResponse<UserDTO>> {
    const result = await super.getById(id);
    if (!result.success) return result as ApiResponse<UserDTO>;

    return {
      success: true,
      data: this.toDTO(result.data!),
    };
  }

  async getUsers(params: UserQueryParams): Promise<ApiResponse<UserDTO[]>> {
    const { data, total } = await this.userRepo.findWithQuery(params);
    const { page, limit } = params;

    return {
      success: true,
      data: data.map((user) => this.toDTO(user)),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateUser(
    id: string,
    data: UserUpdateInput,
  ): Promise<ApiResponse<UserDTO>> {
    // Check email uniqueness if updating email
    if (data.email) {
      const existing = await this.userRepo.findByEmail(data.email);
      if (existing && existing._id.toString() !== id) {
        return {
          success: false,
          error: "Email already in use",
        };
      }
    }

    const result = await super.update(id, data);
    if (!result.success) return result as ApiResponse<UserDTO>;

    return {
      success: true,
      data: this.toDTO(result.data!),
      message: "User updated successfully",
    };
  }

  async deleteUser(id: string): Promise<ApiResponse<void>> {
    // Prevent self-deletion or check for admin rights in real app
    return super.delete(id) as Promise<ApiResponse<void>>;
  }

  private toDTO(user: IUser): UserDTO {
    return {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
} // src/middleware/validate.middleware.ts
import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
// import { ApiResponse } from '../types/common';

export const validate = (schema: {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (schema.body) {
        req.body = schema.body.parse(req.body);
      }
      if (schema.query) {
        req.query = schema.query.parse(req.query);
      }
      if (schema.params) {
        req.params = schema.params.parse(req.params);
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const response: ApiResponse<null> = {
          success: false,
          error: "Validation failed",
          data: error.errors as any,
        };
        res.status(400).json(response);
      } else {
        next(error);
      }
    }
  };
}; // src/middleware/error.middleware.ts
// import { Request, Response, NextFunction } from 'express';
// import { ApiResponse } from '../types/common';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true,
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  let statusCode = 500;
  let message = "Internal server error";
  let isOperational = false;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    isOperational = err.isOperational;
  } else if (err.name === "ValidationError") {
    statusCode = 400;
    message = err.message;
    isOperational = true;
  } else if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format";
    isOperational = true;
  } else if (err.name === "MongoServerError" && (err as any).code === 11000) {
    statusCode = 409;
    message = "Duplicate field value";
    isOperational = true;
  }

  // Log unexpected errors
  if (!isOperational) {
    console.error("Unexpected error:", err);
  }

  const response: ApiResponse<null> = {
    success: false,
    error: message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  };

  res.status(statusCode).json(response);
}; // src/controllers/user.controller.ts
// import { Request, Response, NextFunction } from 'express';
// import { UserService } from '../services/user.service';
// import {
//   UserCreateSchema,
//   UserUpdateSchema,
//   UserParamsSchema,
//   UserQuerySchema,
//   UserCreateInput,
//   UserUpdateInput,
//   UserQueryParams
// } from '../types/user.types';
// import { ApiResponse } from '../types/common';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  create = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const data: UserCreateInput = req.body;
      const result = await this.userService.createUser(data);

      const statusCode = result.success ? 201 : 400;
      res.status(statusCode).json(result);
    } catch (error) {
      next(error);
    }
  };

  getAll = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const params: UserQueryParams = req.query as any;
      const result = await this.userService.getUsers(params);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this.userService.getUserById(id);

      const statusCode = result.success ? 200 : 404;
      res.status(statusCode).json(result);
    } catch (error) {
      next(error);
    }
  };

  update = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const data: UserUpdateInput = req.body;
      const result = await this.userService.updateUser(id, data);

      const statusCode = result.success ? 200 : 400;
      res.status(statusCode).json(result);
    } catch (error) {
      next(error);
    }
  };

  delete = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this.userService.deleteUser(id);

      const statusCode = result.success ? 200 : 404;
      res.status(statusCode).json(result);
    } catch (error) {
      next(error);
    }
  };
} // src/routes/user.routes.ts
import { Router } from "express";
// import { UserController } from '../controllers/user.controller';
// import { validate } from '../middleware/validate.middleware';
// import {
//   UserCreateSchema,
//   UserUpdateSchema,
//   UserParamsSchema,
//   UserQuerySchema
// } from '../types/user.types';

const router = Router();
const userController = new UserController();

router.post("/", validate({ body: UserCreateSchema }), userController.create);

router.get("/", validate({ query: UserQuerySchema }), userController.getAll);

router.get(
  "/:id",
  validate({ params: UserParamsSchema }),
  userController.getById,
);

router.patch(
  "/:id",
  validate({
    params: UserParamsSchema,
    body: UserUpdateSchema,
  }),
  userController.update,
);

router.delete(
  "/:id",
  validate({ params: UserParamsSchema }),
  userController.delete,
);

export default router; // src/routes/index.ts
// import { Router } from 'express';
// import userRoutes from './user.routes';

// const router = Router();

// router.use('/users', userRoutes);
// Add more routes here: router.use('/posts', postRoutes);

// export default router;// src/app.ts
// import express, { Application, Request, Response } from 'express';
// import cors from 'cors';
// import helmet from 'helmet';
// import morgan from 'morgan';
// import routes from './routes';
// import { errorHandler } from './middleware/error.middleware';

// const app: Application = express();

// Security middleware
// app.use(helmet());
// app.use(cors());

// // Body parsing
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Logging
// if (process.env.NODE_ENV !== 'test') {
//   app.use(morgan('dev'));
// }

// // Health check
// app.get('/health', (req: Request, res: Response) => {
//   res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
// });

// // API routes
// app.use('/api/v1', routes);

// // 404 handler
// app.use((req: Request, res: Response) => {
//   res.status(404).json({ success: false, error: 'Route not found' });
// });

// // Global error handler
// app.use(errorHandler);

// // export default app;
