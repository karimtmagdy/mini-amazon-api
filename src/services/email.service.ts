import nodemailer from "nodemailer";
import { env } from "../lib/env";
import { EmailOptions } from "../contract/email.dto";
import { logger } from "../lib/logger";

export class EmailService {
  private transporter;

  constructor() {
    // 1. Create a Transporter
    // This is essentially the connection to your email provider (Gmail, Outlook, etc.)
    this.transporter = nodemailer.createTransport({
      host: env.emailHost,
      port: Number(env.emailPort) || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: env.emailUser,
        pass: env.emailPass,
      },
    });
  }

  /**
   * Send an email to a user
   * @param options Email details (to, subject, message)
   */
  async sendEmail(options: EmailOptions): Promise<void> {
    // 2. Define email options
    const mailOptions = {
      from: `"A-Z Express Support" <${env.emailUser}>`,
      to: options.email,
      subject: options.subject,
      text: options.message, // Fallback plain text
      html: options.html || `<div>${options.message}</div>`, // HTML version
    };

    // 3. Send the email
    try {
      await this.transporter.sendMail(mailOptions);
      logger.log(`📧 Email sent successfully to: ${options.email}`);
    } catch (error) {
      logger.error("❌ Error sending email:", error);
      throw new Error("Email could not be sent");
    }
  }
}

// Export a singleton instance
export const emailService = new EmailService();
