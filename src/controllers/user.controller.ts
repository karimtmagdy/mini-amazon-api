import { Request, Response } from "express";
import { UserService, userService } from "../services/user.service";
import { catchError } from "../lib/catch.error";
import { GlobalResponse, QueryString } from "../schemas/standred.schema";
import { UserDto } from "../contract/user.dto";
import { CreateUser, UpdateUser, UpdateUserRole } from "../schemas/user.schema";

/**
 * Design Pattern: MVC Controller
 * Purpose: Handles user-related HTTP requests and delegates to the user service layer.
 * Responsibilities: User data retrieval endpoints, request validation, and response formatting.
 */
export class UserController {
  constructor(protected userService: UserService) {}

  create = catchError(async (req: Request, res: Response) => {
    const validatedData = req.body as CreateUser;
    const { user } = await this.userService.createByAdmin(validatedData);
    return res.status(200).json({
      status: "success",
      message: "user has been created",
      data: user,
    } satisfies GlobalResponse<UserDto>);
  });
  getOne = catchError(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const { user } = await this.userService.getUserById(id);
    return res.status(200).json({
      status: "success",
      data: user,
    } satisfies GlobalResponse<UserDto>);
  });
  getAll = catchError(async (req: Request, res: Response) => {
    const queryData = req.query as unknown as QueryString;
    const { users } = await this.userService.getAll(queryData);
    return res.status(200).json({
      status: "success",
      meta: users.pagination,
      data: users.data,
    } satisfies GlobalResponse<UserDto[]>);
  });
  changeRoleByAdmin = catchError(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const validatedData = req.body as UpdateUserRole;
    const { user } = await this.userService.changeRole(id, validatedData);
    return res.status(200).json({
      status: "success",
      message: `user role has been changed to ${validatedData}`,
      data: user as UserDto,
    } satisfies GlobalResponse<UserDto>);
  });
  updateUserByAdmin = catchError(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const validatedData = req.body as UpdateUser;
    const { user } = await this.userService.update(id, validatedData);
    return res.status(200).json({
      status: "success",
      message: "user has been updated",
      data: user as UserDto,
    } satisfies GlobalResponse<UserDto>);
  });
  deleteSoftByAdmin = catchError(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const { user } = await this.userService.softDeleteByAdmin(id);
    return res.status(200).json({
      status: "success",
      message: "user has been moved to trash",
      data: user as UserDto,
    } satisfies GlobalResponse<UserDto>);
  });
  unlockByAdmin = catchError(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const { user } = await this.userService.unlockByAdmin(id);
    return res.status(200).json({
      status: "success",
      message: "user has been unlocked",
      data: user as UserDto,
    } satisfies GlobalResponse<UserDto>);
  });
  deactivateByAdmin = catchError(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const { user } = await this.userService.deactivateByAdmin(id);
    return res.status(200).json({
      status: "success",
      message: "user has been deactivated",
      data: user as UserDto,
    } satisfies GlobalResponse<UserDto>);
  });
  updateStatusByAdmin = catchError(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const validatedData = req.body; //as UpdateUserStatus;
    const { user } = await this.userService.updateStatus(id, validatedData);
    return res.status(200).json({
      status: "success",
      message: "user status has been updated",
      data: user as UserDto,
    } satisfies GlobalResponse<UserDto>);
  });
  // reactivateByAdmin = catchError(async (req: Request, res: Response) => {
  //   const { id } = req.params as { id: string };
  //   const { data } = await this.userService.reactivateByAdmin(id);
  //   return res.status(200).json({
  //     status: "success",
  //     message: "user has been reactivated",
  //     data: data as UserDto,
  //   } satisfies GlobalResponse<UserDto>);
  // });
  deleteBulk = catchError(async (req: Request, res: Response) => {
    const { ids } = req.body as { ids: string[] };
    const { users } = await this.userService.deleteBulk(ids);
    return res.status(200).json({
      status: "success",
      message: `${users.modifiedCount} users have been deleted`,
      data: users,
    } satisfies GlobalResponse<{ modifiedCount: number }>);
  });
}

export const userController = new UserController(userService);
