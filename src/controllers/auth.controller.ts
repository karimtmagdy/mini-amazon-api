import type { Request, Response } from "express";
import { authService, type AuthService } from "../services/auth.service";
import { catchError } from "../lib/catch.error";
import type { LoginUser } from "../schemas/user.schema";
import { BaseCookieOptions, CookieOptions } from "../lib/cookie-options";
import { getUserAgent } from "../lib/user-agent";
import { GlobalResponse } from "../schemas/standred.schema";

/**
 * Design Pattern: MVC Controller
 * Purpose: Handles authentication-related HTTP requests and manages cookie-based session tokens.
 * Responsibilities: Login/logout flows, token refresh, multi-device session management, and HTTP response formatting.
 */
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
  logout = catchError(async (req: Request, res: Response) => {
    const cookies = req.cookies as { refreshToken?: string };
    const refreshToken = cookies.refreshToken;

    if (refreshToken) {
      await this.authService.logout(refreshToken);
    }

    res.clearCookie("refreshToken", BaseCookieOptions);
    res.status(200).json({
      status: "success",
      message: "Logged out successfully",
    });
  });
  logoutOtherDevices = catchError(async (req: Request, res: Response) => {
    const { id } = req.user;
    const cookies = req.cookies as { refreshToken?: string };
    const currentToken = cookies.refreshToken;

    await this.authService.logoutOtherDevices(id, currentToken || "");
    res.status(200).json({
      status: "success",
      message: "Logged out from other devices successfully",
    });
  });
  refresh = catchError(async (req: Request, res: Response) => {
    // We can cast here to tell TypeScript we are SURE it exists thanks to Zod
    const { refreshToken: oldRefreshToken } = req.cookies as {
      refreshToken: string;
    };

    const deviceInfo = getUserAgent(req);
    const { accessToken, refreshToken: newRefreshToken } =
      await this.authService.refresh(oldRefreshToken, deviceInfo);

    res.cookie("refreshToken", newRefreshToken, CookieOptions);
    res.status(200).json({
      status: "success",
      message: "Token refreshed successfully",
      data: { token: accessToken },
    } satisfies GlobalResponse<{ token: string }>);
  });
}
export const authController = new AuthController(authService);
