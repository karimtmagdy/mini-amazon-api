export const template = {
  welcome_email: {
    message: `Hi username,\n\nWelcome to A-Z Express. We are excited to have you on board!`,
    html: `<h1>Welcome, username!</h1><p>We are excited to have you on board at A-Z Express.</p>`,
  },
  reset_password: {
    message:
      "Hello,\n\nThis is a confirmation that the password for your account has just been changed.\n",
    html: `<h3>Password Changed</h3><p>Your password has been successfully updated.</p>`,
  },
  forgot_password: {
    message: `Hi username,\n\nYou can reset your password using the link below:\nreset_link\n\nOr use this OTP code: otp_code\n\nThis code is for one-time use and will expire if entered incorrectly.`,
    html: `<h1>Reset Your Password</h1><p>Hi username,</p><p>We received a request to reset your password. You can either click the button below or use the OTP code provided.</p>
    <div style="text-align: center; margin: 20px 0;">
      <a href="reset_link" style="padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; display: inline-block;">Reset with Link</a>
    </div>
    <p>Or enter this code manually:</p>
    <div style="font-size: 24px; font-weight: bold; background: #f4f4f4; padding: 10px; text-align: center; border-radius: 5px; letter-spacing: 5px; margin-bottom: 20px;">otp_code</div>
    <p style="color: red;"><b>Warning:</b> The OTP code is one-shot. Any incorrect attempt will invalidate it.</p>`,
  },
  role_change: {
    message: `Hi username,\n\nYour account role has been updated to: new_role.`,
    html: `<h3>Account Role Updated</h3><p>Hi <b>username</b>,</p><p>Your account role has been successfully updated to: <b>new_role</b>.</p>`,
  },
  account_status: {
    message: `Hi username,\n\nYour account status has been updated to: new_status.`,
    html: `<h3>Account Status Updated</h3><p>Hi <b>username</b>,</p><p>Your account status has been updated to: <b>new_status</b>.</p>`,
  },
  account_locked: {
    message: `Hi username,\n\nYour account has been temporarily locked due to multiple failed login attempts. Please try again in 15 minutes.`,
    html: `<h3>Account Temporarily Locked</h3><p>Hi <b>username</b>,</p><p>We detected multiple failed login attempts on your account. For your security, the account has been locked for 15 minutes.</p><p>If this wasn't you, please consider resetting your password.</p>`,
  },
  email_verification: {
    message: `Hi username,\n\nWelcome to A-Z Express! Please verify your email by clicking the link: verification_link\n\nThis link will expire in 24 hours.`,
    html: `<h1>Verify Your Email</h1><p>Hi username,</p><p>Thank you for joining A-Z Express! Please click the button below to verify your email address:</p><a href="verification_link" style="padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Verify Email</a><p>This link will expire in 24 hours.</p>`,
  },
};
