import * as z from "zod";
import { type UserDto, USER_GENDERS, USER_ROLES } from "../contract/user.dto";
export const emailRegex: RegExp =
  /^[a-zA-Z0-9._%+-]+@(gmail|yahoo|outlook|hotmail)\.(com|net|org)$/;

export const createUserSchema = z.object({
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
    age: z.number().int().min(18, "You must be 18 or older").optional(),
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
}) satisfies z.ZodType<{
  body: Pick<UserDto, "username" | "email" | "password" | "role">;
}>;
// export const updateUserSchema = z.object({
//   body: createUserSchema.shape.body
//     .omit({
//       username: true,
//       email: true,
//       password: true,
//       role: true,
//     })
//     .partial(),
// }) satisfies z.ZodType<{
//   body: Partial<UserDto & Pick<UserDto, "role">>;
// }>;
export const changeRoleSchema = z.object({
  body: z.object({
    role: z.enum(USER_ROLES, {
      message: "Please select a valid role",
    }),
  }),
}) satisfies z.ZodType<{
  body: { role: (typeof USER_ROLES)[number] };
}>;

// export const updateStatusSchema = z.object({
//   body: z.object({
//     status: z.enum(USER_ACCOUNT_STATUS, {
//       message: "Please select a valid status",
//     }),
//   }),
// }) satisfies z.ZodType<{
//   body: { status: (typeof USER_ACCOUNT_STATUS)[number] };
// }>;

export const bulkDeleteSchema = z.object({
  body: z.object({
    ids: z
      .array(z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid User ID format"))
      .min(1, "Please provide at least one user ID"),
  }),
}) satisfies z.ZodType<{
  body: { ids: string[] };
}>;
// export const updateProfileSchema = z.object({
//   body: createUserSchema.shape.body
//     .omit({
//       username: true,
//       email: true,
//       role: true,
//     })
//     .partial()
//     .merge(z.object({ status: z.enum(USER_ACCOUNT_STATUS).optional() })),
// }) satisfies z.ZodType<{
//   body: Partial<UserDto>;
// }>;
export const deleteUserSchema = z.object({
  body: z.object({
    password: z.string({
      message: "Password is required to confirm deletion",
    }),
  }),
}) satisfies z.ZodType<{
  body: Pick<UserDto, "password">;
}>;
const deactivateUserSchema = z.object({
  body: z.object({
    password: z.string({
      message: "Password is required to confirm deactivation",
    }),
  }),
});
export type CreateUser = z.infer<typeof createUserSchema>["body"];
// export type UpdateUser = z.infer<typeof updateUserSchema>["body"];
export type UpdateUserRole = z.infer<typeof changeRoleSchema>["body"];
// export type UpdateStatus = z.infer<typeof updateStatusSchema>["body"];
export type BulkDelete = z.infer<typeof bulkDeleteSchema>["body"];
// export type DefaultUser = z.infer<typeof userSchema>;
// export type UpdateUserProfile = z.infer<typeof updateProfileSchema>["body"];
export type DeleteUser = z.infer<typeof deleteUserSchema>["body"];
type DeactivateUserInput = z.infer<typeof deactivateUserSchema>["body"];
export type DeleteUserInput = z.infer<typeof deleteUserSchema>["body"];
