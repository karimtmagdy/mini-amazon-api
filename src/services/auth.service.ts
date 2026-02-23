import { userRepo, type UserRepo } from "../repo/user.repo";
import { logger } from "../lib/logger";
import ms from "ms";
import { SessionRepository, sessionRepo } from "../repo/session.repo";
import type { DeviceInfo, TokenPayload } from "../contract/sessions.dto";
import { jwtUitl } from "../lib/jwt.lib";
// import type { Document } from "mongoose";
// import type { UserDto } from "../contract/user.dto";
import { env } from "../lib/env";
import { emailService, EmailService } from "./email.service";
import {
  UserAccountStatusEnum,
  UserRoleEnum,
  UserStateEnum,
} from "../contract/user.dto";
import { template } from "../lib/template/template.html";
import { ErrorFactory, ErrorFactory } from "../class/error.factory";

/**
 * Design Pattern: Service Layer + Strategy Pattern
 * Purpose: Handles authentication business logic including login, logout, token refresh, and session management.
 * Responsibilities: Password verification, account status checks, failed login handling, token generation/rotation.
 */
export class AuthService {
  constructor(
    protected userRepo: UserRepo,
    private emailService: EmailService,
    private sessionRepo: SessionRepository,
  ) {}
  async register(username: string, email: string, password: string) {
    const user = await this.userRepo.findByEmail(email);
    if (user) ErrorFactory.throwBadRequest("User already exists");

    const newUser = await this.userRepo.create({
      username,
      email,
      password,
      role: UserRoleEnum.USER,
      status: UserAccountStatusEnum.ACTIVE,
      state: UserStateEnum.ONLINE,
    });
    // Send Welcome Email
    await this.emailService
      .sendEmail({
        email: email,
        subject: "Welcome to A-Z Express! 🎉",
        message: template.welcome_email.message.replace("username", username),
        html: template.welcome_email.html.replace("username", username),
      })
      .catch((err) => logger.error("Failed to send welcome email:", err));
    return newUser;
  }
  async login(email: string, password: string, reqDeviceInfo: DeviceInfo) {
    const user = await this.userRepo.findByEmail(email);
    if (!user) ErrorFactory.throwUnauthorized("Invalid credentials");

    // Check if account is locked
    if (
      user?.status === UserAccountStatusEnum.LOCKED &&
      user.lockedUntil &&
      user.lockedUntil > new Date()
    ) {
      const remainingTime = Math.ceil(
        (user.lockedUntil.getTime() - Date.now()) / (1000 * 60), // in minutes
      );
      ErrorFactory.throwForbidden(
        `Account is locked. Please try again in ${remainingTime} minutes.`,
      );
    }

    const isMatch = await user?.comparePassword(password);
    if (!isMatch) {
      logger.log(`Failed login attempt for email: ${email}`);
      // await this.handleFailedLogin(user);
      ErrorFactory.throwUnauthorized("Invalid credentials");
    }

    // 3. Status checks
    switch (user?.status) {
      case UserAccountStatusEnum.ACTIVE:
        break;
      case UserAccountStatusEnum.INACTIVE:
        break;
      case UserAccountStatusEnum.ARCHIVED:
        break;
      case UserAccountStatusEnum.LOCKED:
        if (user.lockedUntil && user.lockedUntil > new Date()) {
          ErrorFactory.throwForbidden("Your account is currently locked.");
        }
        break;
      case UserAccountStatusEnum.DEACTIVATED:
        break;
      case UserAccountStatusEnum.BANNED:
        ErrorFactory.throwForbidden(
          "Your account has been banned. Please contact support.",
        );
      case UserAccountStatusEnum.PENDING:
        ErrorFactory.throwForbidden(
          "Your account is pending verification. Please check your email.",
        );
      case UserAccountStatusEnum.VERIFIED:
        break;
      default:
        ErrorFactory.throwForbidden(
          "Invalid account status. Please contact support.",
        );
    }

    //   case "locked":
    //     // Only block if the lockout is still active (redundant but safe)
    //     if (user.lockedUntil && user.lockedUntil > new Date()) {
    //       ErrorFactory ("Your account is currently locked.", 403);
    //     }
    //     break;
    //   case "deactivated":
    //     // If deactivated by someone else (Admin), block login
    //     if (updaterId && updaterId !== userId) {
    //       ErrorFactory (
    //         "Your account has been deactivated by an administrator. Please contact support.",
    //         403,
    //       );
    //     }
    //     // If no updater record exists, block login for safety
    //     if (!updaterId) {
    //       ErrorFactory (
    //         "Your account is deactivated. Please contact support for reactivation.",
    //         403,
    //       );
    //     }
    // break;
    //   case "active":
    //   case "inactive":
    //     // These are allowed
    //     break;
    // }

    // 4. Handle successful login (includes reactivation/online update)
    // await this.handleSuccessfulLogin(user);

    const payload = {
      id: user?.id,
      email: user?.email,
      username: user?.username,
      role: user?.role ?? UserRoleEnum.USER,
    } as TokenPayload;

    const token = jwtUitl.generateAccessToken(payload);
    const refreshToken = jwtUitl.generateRefreshToken({ id: user.id }); // Minimal payload

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
  // private async handleFailedLogin(user: any) {
  //   // If the account was previously locked but the time has passed,
  //   // we give the user a fresh start by resetting the counter before this failure.
  //   let attempts = user.failedLoginAttempts || 0;
  //   const isLockExpired =
  //     user.status === "locked" &&
  //     user.lockedUntil &&
  //     user.lockedUntil <= new Date();

  //   if (isLockExpired) {
  //     attempts = 1; // Start from 1 for this new failed attempt after wait
  //   } else {
  //     attempts += 1;
  //   }

  //   logger.log(`Total failed attempts for ${user.email}: ${attempts}`);

  //   const update: any = {
  //     $set: { failedLoginAttempts: attempts },
  //   };

  //   // Lock account after 5 failed attempts
  //   if (attempts >= 5) {
  //     logger.log(`Locking account for ${user.email}`);
  //     update.$set.status = "locked";
  //     update.$set.lockedUntil = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
  //     update.$set.state = "offline";
  //   }

  //   await user.updateOne(update);
  // }
  // private async handleSuccessfulLogin(user: UserDto & Document) {
  //   // Only automatically reactivate if the status is 'inactive' or 'deactivated' (by self)
  //   // Locked accounts also need to be reset if they passed the timed check above
  //   let newStatus = user.status;
  //   if (user.status === "inactive" || user.status === "locked") {
  //     newStatus = "active";
  //   } else if (user.status === "deactivated") {
  //     //   const updaterId =
  //     // user.updatedBy?._id?.toString() || user.updatedBy?.toString();
  //     //   const userId = user._id.toString();
  //     // ONLY reactivate if specifically deactivated by self
  //     // if (updaterId === userId) {
  //     //   newStatus = "active";
  //     // }
  //     // If updaterId is null/undefined, we err on the side of caution and keep it deactivated
  //     // unless we want to allow auto-reactivation for legacy data.
  //     // For now, let's keep it locked if it wasn't obviously self-deactivated.
  //   }

  //   await user.updateOne({
  //     $set: {
  //       state: "online",
  //       status: newStatus,
  //       activeAt: new Date(),
  //       failedLoginAttempts: 0,
  //       lockedUntil: null,
  //     },
  //     $unset: {
  //       logoutAt: "",
  //     },
  //   });
  // }

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
}
export const authService = new AuthService(userRepo, emailService, sessionRepo);
