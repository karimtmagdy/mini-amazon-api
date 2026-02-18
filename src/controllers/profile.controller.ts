import { Request, Response } from "express";
import { profileService, ProfileService } from "../services/profile.service";
import { catchError } from "../lib/catch.error";
import { UserDto } from "../contract/user.dto";
import { UpdateUserProfile } from "../schema/user.schema";
import { ResponseZod } from "../schema/standred.schema";
/**
 * Design Pattern: MVC Controller
 * Purpose: Handles user-related HTTP requests and delegates to the user service layer.
 * Responsibilities: User data retrieval endpoints, request validation, and response formatting.
 */
export class ProfileController {
  constructor(protected profileService: ProfileService) {}
  getUserHimself = catchError(async (req: Request, res: Response) => {
    const id = req.user.id;
    const { user } = await this.profileService.getHimself(id);
    return res.status(200).json({
      status: "success",
      data: user,
    } satisfies ResponseZod<UserDto>);
  });
  deleteImage = catchError(async (req: Request, res: Response) => {
    const id = req.user.id;
    const { user } = await this.profileService.deleteImage(id);
    return res.status(200).json({
      status: "success",
      message: "your image has been deleted",
      data: user as UserDto,
    } satisfies ResponseZod<UserDto>);
  });
  updateUserHimself = catchError(async (req: Request, res: Response) => {
    const id = req.user.id;
    const validatedData = req.body as UpdateUserProfile;
    const { user } = await this.profileService.updateUserHimself(
      id,
      validatedData,
      // req.file,
    );
    return res.status(200).json({
      status: "success",
      message: "your information have been updated",
      data: user as UserDto,
    } satisfies ResponseZod<UserDto>);
  });

  deactivateAccount = catchError(async (req: Request, res: Response) => {
    const id = req.user.id;
    const { user } = await this.profileService.deactivateAccount(id);
    return res.status(200).json({
      status: "success",
      message: "your account has been deactivated",
      data: user as UserDto,
    } satisfies ResponseZod<UserDto>);
  });
  deleteHimself = catchError(async (req: Request, res: Response) => {
    const id = req.user.id;
    const { user } = await this.profileService.deleteHimself(id);
    return res.status(200).json({
      status: "success",
      message: "your account has been deleted",
      data: user as UserDto,
    } satisfies ResponseZod<UserDto>);
  });
}

export const profileController = new ProfileController(profileService);
