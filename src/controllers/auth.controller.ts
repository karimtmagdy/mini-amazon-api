import type { Request, Response } from "express";
import { authService, type AuthService } from "../services/auth.service";
import { catchError } from "../lib/catch.error";
import type { LoginUser } from "../schemas/auth.schema";
import { CookieOptions } from "../lib/cookie-options";
import { getUserAgent } from "../lib/user-agent";
import type { GlobalResponse } from "../contract/global.dto";

export class AuthController {
  constructor(private readonly authService: AuthService) {}
  login = catchError(async (req: Request, res: Response) => {
    const data = req.body as LoginUser;
    const deviceInfo = getUserAgent(req);

    const { user, token, refreshToken } = await this.authService.login(
      data.email,
      data.password,
      deviceInfo,
    );

    res.cookie("refreshToken", refreshToken, CookieOptions);
    res.status(200).json({
      status: "success",
      message: `welcome back ${user.username}`,
      data: { token, user },
    } satisfies GlobalResponse<{
      token: string;
      user: typeof user;
    }>);
  });
}
export const authController = new AuthController(authService);
