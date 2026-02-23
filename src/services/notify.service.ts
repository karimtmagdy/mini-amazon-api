import { emailService, EmailService } from "./email.service";
import { template } from "../lib/template/template.html";
import { logger } from "../lib/logger";

export class NotifyService {
  constructor(private emailService: EmailService) {}

  async sendWelcomeEmail(email: string, username: string) {
    await this.emailService
      .sendEmail({
        email: email,
        subject: "Welcome to A-Z Express! 🎉",
        message: template.welcome_email.message.replace("username", username),
        html: template.welcome_email.html.replace("username", username),
      })
      .catch((err) => logger.error("Failed to send welcome email:", err));
  }

  async sendVerificationEmail(
    email: string,
    username: string,
    verificationLink: string,
  ) {
    await this.emailService
      .sendEmail({
        email: email,
        subject: "Verify Your Email - A-Z Express",
        message: template.email_verification.message
          .replace("username", username)
          .replace("verification_link", verificationLink),
        html: template.email_verification.html
          .replace("username", username)
          .replace("verification_link", verificationLink),
      })
      .catch((err) => logger.error("Failed to send verification email:", err));
  }

  async sendPasswordResetEmail(
    email: string,
    username: string,
    otpCode: string,
    resetLink: string,
  ) {
    await this.emailService
      .sendEmail({
        email: email,
        subject: "Password Reset Request",
        message: template.forgot_password.message
          .replace("username", username)
          .replace("otp_code", otpCode)
          .replace("reset_link", resetLink),
        html: template.forgot_password.html
          .replace("username", username)
          .replace("otp_code", otpCode)
          .replace("reset_link", resetLink),
      })
      .catch((err) => logger.error("Failed to send reset email:", err));
  }

  async sendPasswordChangedConfirmation(email: string) {
    await this.emailService
      .sendEmail({
        email: email,
        subject: "Password Changed Successfully",
        message: template.reset_password.message,
        html: template.reset_password.html,
      })
      .catch((err) => logger.error("Failed to send confirmation email:", err));
  }

  async sendRoleChangeNotification(
    email: string,
    username: string,
    newRole: string,
  ) {
    await this.emailService
      .sendEmail({
        email: email,
        subject: "Account Role Updated",
        message: template.role_change.message
          .replace("username", username)
          .replace("new_role", newRole),
        html: template.role_change.html
          .replace("username", username)
          .replace("new_role", newRole),
      })
      .catch((err) => logger.error("Failed to send role change email:", err));
  }

  async sendAccountStatusNotification(
    email: string,
    username: string,
    newStatus: string,
  ) {
    await this.emailService
      .sendEmail({
        email: email,
        subject: "Account Status Updated",
        message: template.account_status.message
          .replace("username", username)
          .replace("new_status", newStatus),
        html: template.account_status.html
          .replace("username", username)
          .replace("new_status", newStatus),
      })
      .catch((err) =>
        logger.error("Failed to send account status email:", err),
      );
  }

  async sendAccountLockedNotification(email: string, username: string) {
    await this.emailService
      .sendEmail({
        email: email,
        subject: "Security Alert: Account Temporarily Locked",
        message: template.account_locked.message.replace("username", username),
        html: template.account_locked.html.replace("username", username),
      })
      .catch((err) => logger.error("Failed to send account locked email:", err));
  }

  async notifyAdminNewUser() {
    // Implement admin notification logic (e.g., email to admin or push)
  }
}

export const notifyService = new NotifyService(emailService);
