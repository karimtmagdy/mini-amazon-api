import type { UserDto } from "src/contract/user.dto";
import * as z from "zod";

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

export type RegisterUser = z.infer<typeof registerUserSchema>["body"];
export type LoginUser = z.infer<typeof loginUserSchema>["body"];
