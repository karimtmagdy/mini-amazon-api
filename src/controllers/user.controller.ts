import { Request, Response } from "express";
import { UserService, userService } from "../services/user.service";
import { catchError } from "../lib/catch.error";
import { GlobalResponse } from "../contract/global.dto";
import { UserDto } from "../contract/user.dto";
import {
  CreateUser,
  UpdateUser,
  UpdateUserProfile,
} from "src/schemas/user.schema";

/**
 * Design Pattern: MVC Controller
 * Purpose: Handles user-related HTTP requests and delegates to the user service layer.
 * Responsibilities: User data retrieval endpoints, request validation, and response formatting.
 */
export class UserController {
  constructor(protected userService: UserService) {}
  getUserHimself = catchError(async (req: Request, res: Response) => {
    const id = req.user.id;
    const { data } = await this.userService.getHimself(id);
    return res.status(200).json({
      status: "success",
      data: data as UserDto,
    } satisfies GlobalResponse<UserDto>);
  });
  createUser = catchError(async (req: Request, res: Response) => {
    const validatedData = req.body as CreateUser;
    const { data } = await this.userService.createByAdmin(validatedData);
    return res.status(200).json({
      status: "success",
      message: "user has been created successfully",
      data,
    } satisfies GlobalResponse<UserDto>);
  });
  getOneUser = catchError(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const { data } = await this.userService.getHimself(id);
    return res.status(200).json({
      status: "success",
      message: "user retrieved successfully",
      data,
    } satisfies GlobalResponse<UserDto>);
  });
  getAllUsers = catchError(async (req: Request, res: Response) => {
    const { data } = await this.userService.getAll();
    return res.status(200).json({
      status: "success",
      message: "users retrieved successfully",
      data: data as UserDto[],
    } satisfies GlobalResponse<UserDto[]>);
  });
  updateUserHimself = catchError(async (req: Request, res: Response) => {
    const id = req.user.id;
    const validatedData = req.body as UpdateUserProfile;
    const { data } = await this.userService.updateUserHimself(
      id,
      validatedData,
      // req.file,
    );
    return res.status(200).json({
      status: "success",
      message: "your information have been updated",
      data,
    } satisfies GlobalResponse<UserDto>);
  });
  updateUserByAdmin = catchError(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const validatedData = req.body as UpdateUser;
    const { data } = await this.userService.update(id, validatedData);
    return res.status(200).json({
      status: "success",
      message: "user has been updated",
      data: data as UserDto,
    } satisfies GlobalResponse<UserDto>);
  });
  deleteSoftByAdmin = catchError(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const { data } = await this.userService.softDeleteByAdmin(id);
    return res.status(200).json({
      status: "success",
      message: "user has been moved to trash",
      data: data as UserDto,
    } satisfies GlobalResponse<UserDto>);
  });
  unlockByAdmin = catchError(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const { data } = await this.userService.unlockByAdmin(id);
    return res.status(200).json({
      status: "success",
      message: "user has been unlocked",
      data: data as UserDto,
    } satisfies GlobalResponse<UserDto>);
  });
  deactivateByAdmin = catchError(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const { data } = await this.userService.deactivateByAdmin(id);
    return res.status(200).json({
      status: "success",
      message: "user has been deactivated",
      data: data as UserDto,
    } satisfies GlobalResponse<UserDto>);
  });
  deactivateAccount = catchError(async (req: Request, res: Response) => {
    const id = req.user.id;
    const { data } = await this.userService.deactivateByAdmin(id);
    return res.status(200).json({
      status: "success",
      message: "your account has been deactivated",
      data: data as UserDto,
    } satisfies GlobalResponse<UserDto>);
  });
  deleteHimself = catchError(async (req: Request, res: Response) => {
    const id = req.user.id;
    const { data } = await this.userService.deleteHimself(id);
    return res.status(200).json({
      status: "success",
      message: "your account has been deleted",
      data: data as UserDto,
    } satisfies GlobalResponse<UserDto>);
  });
  deleteBulk = catchError(async (req: Request, res: Response) => {
    const { ids } = req.body as { ids: string[] };
    const { data } = await this.userService.deleteBulk(ids);
    return res.status(200).json({
      status: "success",
      message: `${data.modifiedCount} users have been deleted`,
      data,
    } satisfies GlobalResponse<{ modifiedCount: number }>);
  });
}

export const userController = new UserController(userService);
