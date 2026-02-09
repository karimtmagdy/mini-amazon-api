import * as z from "zod/v4";
import {
  type UserDto,
  USER_GENDERS,
  USER_ROLES,
  USER_ACCOUNT_STATUS,
} from "../contract/user.dto";
export const emailRegex: RegExp =
  /^[a-zA-Z0-9._%+-]+@(gmail|yahoo|outlook|hotmail)\.(com|net|org)$/;

export const defaultUserZod = z
  .object({
    body: z.object({
      username: z
        .string()
        .min(3, "Username must be at least 3 characters")
        .max(50, "Username must be less than 50 characters")
        .transform((username) => username.trim()),
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
      gender: z.enum(USER_GENDERS).optional(),
      age: z
        .number()
        .int()
        .refine((age) => age >= 18, "You must be 18 or older")
        .optional(),
      name: z
        .object({
          first: z
            .string()
            .min(3, "First name must be at least 3 characters")
            .max(20, "First name must be less than 20 characters"),
          last: z
            .string()
            .min(3, "Last name must be at least 3 characters")
            .max(20, "Last name must be less than 20 characters"),
        })
        .transform((name) => ({
          first: name.first.trim(),
          last: name.last.trim(),
        }))
        .optional(),
      image: z
        .object({
          secureUrl: z.string(),
          publicId: z.string(),
        })
        .optional(),
      role: z.enum(USER_ROLES).default("user"),
    }),
  })
  .strict();
// create user schema
export const createUserZod = z.object({
  body: defaultUserZod
    .clone()
    .shape.body.omit({ gender: true, image: true, age: true, name: true }),
});
// update user schema
export const updateUserZod = z.object({
  body: defaultUserZod
    .clone()
    .shape.body.partial()
    .omit({ email: true, image: true, age: true, gender: true }),
});
// change role schema
export const changeRoleZod = z.object({
  body: defaultUserZod
    .clone()
    .shape.body.shape.role.refine((role) => USER_ROLES.includes(role), {
      message: "Please select a valid role",
    }),
});

// register user schema
export const registerUserSchema = z.object({
  body: defaultUserZod.shape.body
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
    }),
});
export const resetPasswordZod = z.object({
  body: defaultUserZod.shape.body
    .pick({
      password: true,
    })
    .extend({
      confirmPassword: z.string({ message: "Confirm password is required" }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }),
});
// login user schema
export const loginUserSchema = z.object({
  body: defaultUserZod.shape.body.pick({
    email: true,
    password: true,
  }),
});
// update profile schema
export const updateProfileZod = z.object({
  // .merge(z.object({ status: z.enum(USER_ACCOUNT_STATUS).optional() })),
  body: defaultUserZod.shape.body
    .omit({
      username: true,
      email: true,
      role: true,
    })
    .partial(),
});
export const forgotPasswordZod = z.object({
  body: defaultUserZod.shape.body.pick({
    email: true,
  }),
});
export type RegisterUser = z.infer<typeof registerUserSchema>["body"];
export type LoginUser = z.infer<typeof loginUserSchema>["body"];
export type CreateUser = z.infer<typeof createUserZod>["body"];
export type UpdateUser = z.infer<typeof updateUserZod>["body"];
export type UpdateUserRole = z.infer<typeof changeRoleZod>["body"];
export type UpdateUserProfile = z.infer<typeof updateProfileZod>["body"];
export type ForgotPassword = z.infer<typeof forgotPasswordZod>["body"];
export type ResetPassword = z.infer<typeof resetPasswordZod>["body"];
