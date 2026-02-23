import { userRepo, type UserRepo } from "../repo/user.repo";
import { logger } from "../lib/logger";
import ms from "ms";
import { SessionRepository, sessionRepo } from "../repo/session.repo";
import type { DeviceInfo, TokenPayload } from "../contract/sessions.dto";
import { jwtUitl } from "../lib/jwt.lib";
import { env } from "../lib/env";
import { notifyService, NotifyService } from "./notify.service";
import {
  UserAccountStatusEnum,
  UserRoleEnum,
  UserStateEnum,
} from "../contract/user.dto";
import { ErrorFactory } from "../class/error.factory";
import speakeasy from "speakeasy";
import qrcode from "qrcode";

/**
 * Design Pattern: Service Layer + Strategy Pattern
 * Purpose: Handles authentication business logic including login, logout, token refresh, and session management.
 * Responsibilities: Password verification, account status checks, failed login handling, token generation/rotation.
 */
export class AuthService {
  constructor(
    protected userRepo: UserRepo,
    private notifyService: NotifyService,
    private sessionRepo: SessionRepository,
  ) {}
  async register(username: string, email: string, password: string) {
    const user = await this.userRepo.findByEmail(email);
    if (user) ErrorFactory.throwBadRequest("User already exists");

    const newUser = await this.userRepo.create({
      username,
      email,
      password,
      status: UserAccountStatusEnum.PENDING,
    });

    const verificationToken = jwtUitl.generateVerificationToken({
      id: newUser.id,
    });
    const verificationLink = `${env.frontendUrl}/verify-email/${verificationToken}`;

    // Send Verification Email
    await this.notifyService.sendVerificationEmail(
      email,
      username,
      verificationLink,
    );
    return newUser;
  }
  async login(email: string, password: string, reqDeviceInfo: DeviceInfo) {
    const user = await this.userRepo.findByEmail(email);
    if (!user) ErrorFactory.throwUnauthorized("Invalid credentials");

    // 3. Status checks
    const now = new Date();
    switch (user.status) {
      case UserAccountStatusEnum.ACTIVE:
        break;
      case UserAccountStatusEnum.VERIFIED:
        break;
      case UserAccountStatusEnum.INACTIVE:
        // Allow login but maybe log it?
        break;
      case UserAccountStatusEnum.LOCKED:
        if (user.lockedUntil && user.lockedUntil > now) {
          const remainingMinutes = Math.ceil(
            (user.lockedUntil.getTime() - now.getTime()) / (1000 * 60),
          );
          ErrorFactory.throwForbidden(
            `Account is locked. Please try again in ${remainingMinutes} minutes.`,
          );
        }
        // Lock expired, treated as active in handleSuccessfulLogin
        break;
      case UserAccountStatusEnum.DEACTIVATED:
        ErrorFactory.throwForbidden(
          "Your account has been deactivated. Please contact support.",
        );
        break;
      case UserAccountStatusEnum.BANNED:
        ErrorFactory.throwForbidden(
          "Your account has been banned due to policy violations.",
        );
        break;
      case UserAccountStatusEnum.ARCHIVED:
        ErrorFactory.throwForbidden("Account not found.");
        break;
      case UserAccountStatusEnum.PENDING:
        ErrorFactory.throwForbidden(
          "Your account is pending verification. Please check your email.",
        );
        break;
      default:
        ErrorFactory.throwForbidden("Unauthorized access.");
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      await this.handleFailedLogin(user);
      ErrorFactory.throwUnauthorized("Invalid credentials");
    }

    // 4. Handle successful login (resets attempts, updates status/state)
    await this.handleSuccessfulLogin(user);

    // 4.5 Check 2FA
    if (user.twoFactorEnabled) {
      const loginToken = jwtUitl.generateResetToken({ id: user.id }); // Reuse reset token logic for temporary login token
      return { status: "2FA_REQUIRED", loginToken };
    }

    const payload: TokenPayload = {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role ?? UserRoleEnum.USER,
    };

    const token = jwtUitl.generateAccessToken(payload);
    const refreshToken = jwtUitl.generateRefreshToken({ id: user.id });

    // 5. Create Session
    const expiresIn = (env.refreshExpiresIn as ms.StringValue) || "7d";
    const parsedMs = ms(expiresIn);

    // Safety check: if ms() fails to parse, default to 7 days (604800000 ms)
    const expiresDuration = typeof parsedMs === "number" ? parsedMs : ms("7d");
    const expiresAt = new Date(Date.now() + expiresDuration);

    await this.sessionRepo.create({
      userId: user.id,
      refreshToken,
      deviceInfo: reqDeviceInfo,
      expiresAt,
    });

    return { user: payload, token, refreshToken };
  }
  private async handleFailedLogin(user: any) {
    let attempts = (user.failedLoginAttempts || 0) + 1;
    const update: any = {
      $set: { failedLoginAttempts: attempts },
    };

    // Lock account after 5 failed attempts
    if (attempts >= 5) {
      logger.warn(
        `Locking account for ${user.email} after ${attempts} attempts`,
      );
      update.$set.status = UserAccountStatusEnum.LOCKED;
      update.$set.lockedUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes lockout
      update.$set.state = UserStateEnum.OFFLINE;

      // Notify user about security lockout
      await this.notifyService.sendAccountLockedNotification(
        user.email,
        user.username,
      );
    }

    await user.updateOne(update);
  }

  private async handleSuccessfulLogin(user: any) {
    let newStatus = user.status;

    // Auto-reactivate if status was locked (and we reached here, meaning lockout expired) or inactive
    if (
      user.status === UserAccountStatusEnum.LOCKED ||
      user.status === UserAccountStatusEnum.INACTIVE
    ) {
      newStatus = UserAccountStatusEnum.ACTIVE;
    }

    await user.updateOne({
      $set: {
        state: UserStateEnum.ONLINE,
        status: newStatus,
        activeAt: new Date(),
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
      $unset: {
        logoutAt: "",
      },
    });
  }

  async logout(refreshToken: string) {
    const session = await this.sessionRepo.findByToken(refreshToken);
    if (!session) return;
    const user = await this.userRepo.findById(session.userId.toString());
    if (user) {
      await user.updateOne({
        $set: { state: UserStateEnum.OFFLINE, logoutAt: new Date() },
      });
    }
    await this.sessionRepo.deleteByToken(refreshToken);
  }
  async logoutOtherDevices(userId: string, currentToken: string) {
    const user = await this.userRepo.findById(userId);
    await this.sessionRepo.deleteOtherSessions(userId, currentToken);
    await user?.updateOne({ $unset: { logoutAt: new Date() } });
  }
  async refresh(refreshToken: string, reqDeviceInfo: DeviceInfo) {
    const payload = jwtUitl.verifyRefreshToken(refreshToken);
    const session = await this.sessionRepo.findByToken(refreshToken);
    if (!session)
      ErrorFactory.throwUnauthorized("Invalid or expired refresh token");

    const user = await this.userRepo.findById(payload.id);
    if (!user || user.status !== UserAccountStatusEnum.ACTIVE) {
      ErrorFactory.throwUnauthorized("User not found or inactive");
    }

    // Token Rotation Logic:
    // 1. Delete the old session
    await this.sessionRepo.deleteByToken(refreshToken);

    // 2. Generate new tokens
    const newTokenPayload: TokenPayload = {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role ?? UserRoleEnum.USER,
    };
    const accessToken = jwtUitl.generateAccessToken(newTokenPayload);
    const newRefreshToken = jwtUitl.generateRefreshToken({ id: user.id });

    // 3. Create new session
    const expiresIn = (env.refreshExpiresIn as ms.StringValue) || "7d";
    const parsedMs = ms(expiresIn);

    // Safety check: if ms() fails to parse, default to 7 days
    const expiresDuration = typeof parsedMs === "number" ? parsedMs : ms("7d");
    const expiresAt = new Date(Date.now() + expiresDuration);

    await this.sessionRepo.create({
      userId: user.id,
      refreshToken: newRefreshToken,
      deviceInfo: reqDeviceInfo,
      expiresAt,
    });

    return { accessToken, refreshToken: newRefreshToken };
  }
  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ) {
    const user = await this.userRepo.findById(userId);
    if (!user) ErrorFactory.throwUnauthorized("User not found");
    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) ErrorFactory.throwUnauthorized("Invalid credentials");
    user.password = newPassword;
    await user.save();
    return { user };
  }
  async forgotPassword(email: string) {
    const user = await this.userRepo.findByEmail(email);
    if (!user) ErrorFactory.throwNotFound("User not found");

    // 1. Generate OTP (One-Shot)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.resetOtp = {
      code: otp,
      expiresAt,
    };

    // 2. Generate JWT Link (Standard)
    const resetToken = jwtUitl.generateResetToken({ id: user.id });
    const resetLink = `${env.clientUrl}/reset-password/${resetToken}`;

    await user.save();

    await this.notifyService.sendPasswordResetEmail(
      user.email,
      user.username,
      otp,
      resetLink,
    );

    return { message: "Password reset instructions sent to your email" };
  }

  async resetPassword(
    newPassword: string,
    email?: string,
    otp?: string,
    token?: string,
  ) {
    let user;

    if (token) {
      // Logic A: Standard JWT Link
      const payload = jwtUitl.verifyResetToken(token);
      user = await this.userRepo.findById(payload.id);
    } else if (email && otp) {
      // Logic B: Strict One-Shot OTP
      user = await this.userRepo.findByEmail(email);
      if (!user) ErrorFactory.throwNotFound("User not found");

      if (!user.resetOtp || !user.resetOtp.code) {
        ErrorFactory.throwBadRequest("No active reset request found");
      }

      if (user.resetOtp.expiresAt < new Date()) {
        user.resetOtp = null;
        await user.save();
        ErrorFactory.throwBadRequest("Reset code has expired");
      }

      const isMatch = user.resetOtp.code === otp;
      if (!isMatch) {
        user.resetOtp = null; // Strict Invalidation
        await user.save();
        ErrorFactory.throwBadRequest(
          "Invalid reset code. For security, this code has been invalidated.",
        );
      }
    } else {
      ErrorFactory.throwBadRequest("Reset token or OTP is required");
    }

    if (!user) ErrorFactory.throwUnauthorized("User not found");

    // Success logic for both paths
    user.password = newPassword;
    user.resetOtp = null; // Clear OTP if it was used or existed
    await user.save();

    await this.sessionRepo.deleteByUserId(user.id);
    await this.notifyService.sendPasswordChangedConfirmation(user.email);

    return { message: "Password updated successfully" };
  }
  async verifyEmail(token: string) {
    const payload = jwtUitl.verifyVerificationToken(token);
    const user = await this.userRepo.findById(payload.id);

    if (!user) ErrorFactory.throwUnauthorized("User not found");

    if (user.status === UserAccountStatusEnum.ACTIVE) {
      return { message: "Email already verified", user };
    }

    user.status = UserAccountStatusEnum.ACTIVE;
    user.verifiedAt = new Date();
    await user.save();

    // After verification, we can send the welcome email
    await this.notifyService.sendWelcomeEmail(user.email, user.username);

    return { user };
  }

  // --- 2FA Logic ---

  async setup2FA(userId: string) {
    const user = await this.userRepo.findById(userId);
    if (!user) ErrorFactory.throwNotFound("User not found");

    const secret = speakeasy.generateSecret({
      name: `A-Z Express (${user.email})`,
    });

    const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url || "");

    // Temporarily save secret (not enabled yet)
    await user.updateOne({ $set: { twoFactorSecret: secret.base32 } });

    return {
      secret: secret.base32,
      qrCode: qrCodeUrl,
    };
  }

  async verify2FA(userId: string, token: string) {
    const user = await this.userRepo.findById(userId);
    if (!user || !user.twoFactorSecret) {
      ErrorFactory.throwBadRequest("2FA is not set up");
    }

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: "base32",
      token,
    });

    if (!verified) {
      ErrorFactory.throwBadRequest("Invalid 2FA token");
    }

    return user;
  }

  async enable2FA(userId: string, token: string) {
    await this.verify2FA(userId, token);
    const user = await this.userRepo.findById(userId);
    if (user) {
      user.twoFactorEnabled = true;
      await user.save();
    }
    return { message: "2FA enabled successfully" };
  }

  async disable2FA(userId: string, token: string) {
    await this.verify2FA(userId, token);
    const user = await this.userRepo.findById(userId);
    if (user) {
      user.twoFactorEnabled = false;
      await user.updateOne({ $unset: { twoFactorSecret: "" } });
      await user.save();
    }
    return { message: "2FA disabled successfully" };
  }

  async loginWith2FA(loginToken: string, token2FA: string, reqDeviceInfo: DeviceInfo) {
    const payload = jwtUitl.verifyResetToken(loginToken); // Using verification logic for temp token
    const user = await this.userRepo.findById(payload.id);

    if (!user || !user.twoFactorEnabled || !user.twoFactorSecret) {
      ErrorFactory.throwUnauthorized("Invalid request");
    }

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: "base32",
      token: token2FA,
    });

    if (!verified) {
      ErrorFactory.throwBadRequest("Invalid 2FA token");
    }

    // Success: Generate full tokens
    const userPayload: TokenPayload = {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role ?? UserRoleEnum.USER,
    };

    const token = jwtUitl.generateAccessToken(userPayload);
    const refreshToken = jwtUitl.generateRefreshToken({ id: user.id });

    const expiresIn = (env.refreshExpiresIn as ms.StringValue) || "7d";
    const expiresDuration = ms(expiresIn) || ms("7d");
    const expiresAt = new Date(Date.now() + (typeof expiresDuration === "number" ? expiresDuration : 0));

    await this.sessionRepo.create({
      userId: user.id,
      refreshToken,
      deviceInfo: reqDeviceInfo,
      expiresAt,
    });

    return { user: userPayload, token, refreshToken };
  }
}
export const authService = new AuthService(
  userRepo,
  notifyService,
  sessionRepo,
);
