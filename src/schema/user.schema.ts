import * as z from "zod/v4";
import {
  USER_GENDERS,
  USER_ROLES,
  USER_ACCOUNT_STATUS,
  USER_STATE,
} from "../contract/user.dto";
import { emailRegex } from "./standred.schema";

export const defaultUserZod = z
  .object({
    body: z.object({
      username: z
        .string({ message: "Username is required" })
        .min(3, { message: "Username must be at least 3 characters" })
        .max(50, { message: "Username must be less than 50 characters" })
        .transform((username) => username.trim()),
      email: z
        .email({ message: "Invalid email format" })
        .trim()
        .regex(emailRegex, "Invalid email address")
        .transform((email) => email.toLowerCase()),
      password: z
        .string({ message: "Password is required" })
        .min(6, { message: "Password must be at least 6 characters" })
        .max(30, { message: "Password must be at most 30 characters" }),
      gender: z.enum(USER_GENDERS).optional(),
      age: z
        .number({ message: "Age is required" })
        .int()
        .refine((age) => age >= 18, "You must be 18 or older")
        .optional(),
      name: z
        .object({
          first: z
            .string({ message: "First name is required" })
            .min(3, { message: "First name must be at least 3 characters" })
            .max(20, { message: "First name must be less than 20 characters" }),
          last: z
            .string({ message: "Last name is required" })
            .min(3, { message: "Last name must be at least 3 characters" })
            .max(20, { message: "Last name must be less than 20 characters" }),
        })
        .transform((name) => ({
          first: name.first.trim(),
          last: name.last.trim(),
        }))
        .optional(),
      image: z.object({ url: z.url(), publicId: z.string() }).optional(),
      role: z.enum(USER_ROLES).default("user"),
      status: z.enum(USER_ACCOUNT_STATUS).default("active"),
      state: z.enum(USER_STATE).default("offline"),
    }),
  })
  .strict();
// create user schema
export const createUserZod = defaultUserZod
  .clone()
  .shape.body.omit({ gender: true, image: true, age: true, name: true });

// update user schema
export const updateUserZod = defaultUserZod
  .clone()
  .shape.body.partial()
  .omit({ email: true, image: true, age: true, gender: true });

// change role schema
export const changeRoleZod = defaultUserZod
  .clone()
  .shape.body.shape.role.refine((role) => USER_ROLES.includes(role), {
    message: "select a valid role",
  });
// register user schema
export const registerUserZod = defaultUserZod.shape.body
  .pick({
    email: true,
    username: true,
    password: true,
  })
  .extend({
    confirmPassword: z.string({ message: "Confirm password is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const resetPasswordZod = defaultUserZod.shape.body
  .pick({
    password: true,
  })
  .extend({
    confirmPassword: z.string({ message: "Confirm password is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
// login user schema
export const loginUserZod = defaultUserZod.shape.body.pick({
  email: true,
  password: true,
});
// update profile schema
// .merge(z.object({ status: z.enum(USER_ACCOUNT_STATUS).optional() })),
export const updateProfileZod = defaultUserZod.shape.body
  .omit({
    username: true,
    email: true,
    role: true,
  })
  .partial();

export const forgotPasswordZod = defaultUserZod.shape.body.pick({
  email: true,
});
export type RegisterUser = z.infer<typeof registerUserZod>;
export type LoginUser = z.infer<typeof loginUserZod>;
export type CreateUser = z.infer<typeof createUserZod>;
export type UpdateUser = z.infer<typeof updateUserZod>;
export type UpdateUserRole = z.infer<typeof changeRoleZod>;
export type UpdateUserProfile = z.infer<typeof updateProfileZod>;
export type ForgotPassword = z.infer<typeof forgotPasswordZod>;
export type ResetPassword = z.infer<typeof resetPasswordZod>;
