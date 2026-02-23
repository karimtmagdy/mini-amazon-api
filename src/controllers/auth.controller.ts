import type { Request, Response } from "express";
import { authService, type AuthService } from "../services/auth.service";
import { catchError } from "../lib/catch.error";
import type {
  LoginUser,
  RegisterUser,
  ResetPassword,
  ForgotPassword,
  LoginWith2FA,
  Verify2FA,
} from "../schema/user.schema";
import { BaseCookieOptions, CookieOptions } from "../lib/cookie-options";
import { getUserAgent } from "../lib/user-agent";
import { ResponseZod } from "../schema/standred.schema";
import { ChangePassword } from "../schema/auth.schema";
/**
 * Design Pattern: MVC Controller
 * Purpose: Handles authentication-related HTTP requests and manages cookie-based session tokens.
 * Responsibilities: Login/logout flows, token refresh, multi-device session management, and HTTP response formatting.
 */
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  register = catchError(async (req: Request, res: Response) => {
    const data = req.body as RegisterUser;
    const { username, email } = await this.authService.register(
      data.username,
      data.email,
      data.password,
    );
    res.status(200).json({
      status: "success",
      message: "user registered successfully",
      data: { username, email },
    } satisfies ResponseZod<{
      username: string;
      email: string;
    }>);
  });
  login = catchError(async (req: Request, res: Response) => {
    const { email, password } = req.body as LoginUser;
    const deviceInfo = getUserAgent(req);
    const result = await this.authService.login(email, password, deviceInfo);

    if ("status" in result && result.status === "2FA_REQUIRED") {
      res.status(200).json({
        status: "success",
        message: "2FA Required",
        data: { loginToken: result.loginToken },
      } satisfies ResponseZod<{ loginToken: string }>);
      return;
    }

    const { user, token, refreshToken } = result as any;

    res.cookie("refreshToken", refreshToken, CookieOptions);
    res.status(200).json({
      status: "success",
      message: `welcome back ${user.username}`,
      data: { token, user },
    } satisfies ResponseZod<{
      token: string;
      user: any;
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
    } satisfies ResponseZod<{ status: string; message: string }>);
  });
  logoutOtherDevices = catchError(async (req: Request, res: Response) => {
    const { id } = req.user;
    const cookies = req.cookies as { refreshToken?: string };
    const currentToken = cookies.refreshToken;

    await this.authService.logoutOtherDevices(id, currentToken || "");
    res.status(200).json({
      status: "success",
      message: "Logged out from other devices successfully",
    } satisfies ResponseZod<{ status: string; message: string }>);
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
    } satisfies ResponseZod<{ token: string }>);
  });
  changePassword = catchError(async (req: Request, res: Response) => {
    const { id } = req.user;
    const { oldPassword, newPassword } = req.body as ChangePassword;
    await this.authService.changePassword(id, oldPassword, newPassword);
    res.status(200).json({
      status: "success",
      message: "Password changed successfully",
    } satisfies ResponseZod<{ status: string; message: string }>);
  });
  forgotPassword = catchError(async (req: Request, res: Response) => {
    const { email } = req.body as ForgotPassword;
    await this.authService.forgotPassword(email);
    res.status(200).json({
      status: "success",
      message: "Reset code sent to your email",
    } satisfies ResponseZod<{ status: string; message: string }>);
  });
  resetPassword = catchError(async (req: Request, res: Response) => {
    const { email, otp, password } = req.body as ResetPassword;
    const { token } = req.params as { token?: string };

    await this.authService.resetPassword(password, email, otp, token);

    res.status(200).json({
      status: "success",
      message: "Password reset successfully",
    } satisfies ResponseZod<{ status: string; message: string }>);
  });
  verifyEmail = catchError(async (req: Request, res: Response) => {
    const token = req.params.token as string;
    await this.authService.verifyEmail(token);
    res.status(200).json({
      status: "success",
      message: "Email verified successfully",
    } satisfies ResponseZod<{ status: string; message: string }>);
  });

  // --- 2FA Controllers ---

  setup2FA = catchError(async (req: Request, res: Response) => {
    const { id } = req.user;
    const data = await this.authService.setup2FA(id);
    res.status(200).json({
      status: "success",
      message: "2FA setup initiated",
      data,
    } satisfies ResponseZod<any>);
  });

  enable2FA = catchError(async (req: Request, res: Response) => {
    const { id } = req.user;
    const { token } = req.body as Verify2FA;
    const result = await this.authService.enable2FA(id, token);
    res.status(200).json({
      status: "success",
      message: result.message,
    } satisfies ResponseZod<{ status: string; message: string }>);
  });

  disable2FA = catchError(async (req: Request, res: Response) => {
    const { id } = req.user;
    const { token } = req.body as Verify2FA;
    const result = await this.authService.disable2FA(id, token);
    res.status(200).json({
      status: "success",
      message: result.message,
    } satisfies ResponseZod<{ status: string; message: string }>);
  });

  verify2FALogin = catchError(async (req: Request, res: Response) => {
    const { loginToken, token2FA } = req.body as LoginWith2FA;
    const deviceInfo = getUserAgent(req);
    const { user, token, refreshToken } = await this.authService.loginWith2FA(
      loginToken,
      token2FA,
      deviceInfo,
    );

    res.cookie("refreshToken", refreshToken, CookieOptions);
    res.status(200).json({
      status: "success",
      message: `welcome back ${user.username}`,
      data: { token, user },
    } satisfies ResponseZod<{ token: string; user: any }>);
  });
}
export const authController = new AuthController(authService);
