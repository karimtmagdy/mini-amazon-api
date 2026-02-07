import { Request, Response } from "express";
import { UserService, userService } from "../services/user.service";
import { catchError } from "../lib/catch.error";
import { GlobalResponse } from "../contract/global.dto";
import { UserDto } from "../contract/user.dto";
export class UserController {
  constructor(protected userService: UserService) {}
  getUserHimself = catchError(async (req: Request, res: Response) => {
    const id = req?.user?.id;
    const user = await this.userService.getUserHimself(id);
    return res.status(200).json({
      status: "success",
      data: user,
    } satisfies GlobalResponse<UserDto>);
  });
}

export const userController = new UserController(userService);
