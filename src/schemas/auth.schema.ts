import * as z from "zod";
import type { UserDto } from "../contract/user.dto";

export const emailRegex: RegExp =
  /^[a-zA-Z0-9._%+-]+@(gmail|yahoo|outlook|hotmail)\.(com|net|org)$/;

export const registerUserSchema = z.object({
  body: z
    .object({
      username: z
        .string()
        .min(3, "Username must be at least 3 characters")
        .max(50, "Username must be at most 50 characters"),
      email: z
        .string({ message: "Email is required" })
        .trim()
        .regex(emailRegex, "Invalid email address")
        .email("Invalid email format")
        .transform((email) => email.toLowerCase()),
      password: z
        .string({ message: "Password is required" })
        .min(6, { message: "Password must be at least 6 characters" })
        .max(30, { message: "Password must be at most 30 characters" }),
      confirmPassword: z
        .string({ message: "Password is required" })
        .min(6, { message: "Password must be at least 6 characters" })
        .max(30, { message: "Password must be at most 30 characters" }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }),
}) satisfies z.ZodType<{
  body: Pick<UserDto, "username" | "email" | "password">;
}>;
export const loginUserSchema = z.object({
  body: z.object({
    email: z
      .string({ message: "Email is required" })
      .trim()
      .regex(emailRegex, "Invalid email address")
      .email("Invalid email format")
      .transform((email) => email.toLowerCase()),
    password: z
      .string({ message: "Password is required" })
      .min(6, { message: "Password must be at least 6 characters" })
      .max(30, { message: "Password must be at most 30 characters" }),
  }),
}) satisfies z.ZodType<{
  body: Pick<UserDto, "email" | "password">;
}>;
export const resetPasswordSchema = z.object({
  body: z
    .object({
      password: z
        .string({ message: "Password is required" })
        .min(6, { message: "Password must be at least 6 characters" })
        .max(30, { message: "Password must be at most 30 characters" }),
      confirmPassword: z.string({ message: "Confirm password is required" }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }),
}) satisfies z.ZodType<{ body: Pick<UserDto, "password"> }>;
export const changePasswordSchema = z.object({
  body: z
    .object({
      oldPassword: z.string({ message: "Old password is required" }),
      newPassword: z
        .string({ message: "New password is required" })
        .min(6, { message: "New password must be at least 6 characters" })
        .max(30, { message: "New password must be at most 30 characters" }),
      confirmPassword: z.string({ message: "Confirm password is required" }),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }),
}) satisfies z.ZodType<{
  body: { oldPassword: string; newPassword: string; confirmPassword: string };
}>;
export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z
      .string({ message: "Email is required" })
      .trim()
      .regex(emailRegex, "Invalid email address")
      .email("Invalid email format")
      .transform((email) => email.toLowerCase()),
  }),
}) satisfies z.ZodType<{ body: Pick<UserDto, "email"> }>;
export const deactivateUserSchema = z.object({
  body: z.object({
    password: z.string({
      message: "Password is required to confirm deactivation",
    }),
  }),
}) satisfies z.ZodType<{
  body: Pick<UserDto, "password">;
}>;
export const refreshTokenSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      message: "Refresh token is missing",
    }),
  }),
});
export type RegisterUser = z.infer<typeof registerUserSchema>["body"];
export type LoginUser = z.infer<typeof loginUserSchema>["body"];
export type ResetPassword = z.infer<typeof resetPasswordSchema>["body"];
export type ChangePassword = z.infer<typeof changePasswordSchema>["body"];
export type ForgotPassword = z.infer<typeof forgotPasswordSchema>["body"];
export type DeactivateUser = z.infer<typeof deactivateUserSchema>["body"];
