export class NotifyService {
  constructor() {}

  static async notifyAdminNewUser() {}
  static async notifyUser({
    email,
    subject,
    message,
    html,
  }: {
    email: string;
    subject: string;
    message: string;
    html?: string;
  }) {}
  static async notifyRoleChange() {}
  static async sendWelcomeEmail() {}
  static async sendPasswordResetEmail() {}
  static async sendNotificationEmail() {}
}
export const notifyService = new NotifyService();
