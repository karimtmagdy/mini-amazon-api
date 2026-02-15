import * as z from "zod/v4";
import { defaultUserZod } from "./user.schema";

export const emailRegex: RegExp =
  /^[a-zA-Z0-9._%+-]+@(gmail|yahoo|outlook|hotmail)\.(com|net|org)$/;

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

export const deactivateUserSchema = z.object({
  body: z.object({
    password: z.string({
      message: "Password is required to confirm deactivation",
    }),
  }),
}) satisfies z.ZodType<{ body: { password: string } }>;
export const refreshTokenSchema = z.object({
  cookies: z.object({
    refreshToken: z
      .string({
        message: "Refresh token is missing",
      })
      .min(1, "Refresh token cannot be empty"),
  }),
});
export type ChangePassword = z.infer<typeof changePasswordSchema>["body"];
export type DeactivateUser = z.infer<typeof deactivateUserSchema>["body"];

// --------------------------------
import { type UserDto } from "../contract/user.dto";

// export const updateStatusSchema = z.object({
//   body: z.object({
//     status: z.enum(USER_ACCOUNT_STATUS, {
//       message: "Please select a valid status",
//     }),
//   }),
// }) satisfies z.ZodType<{
//   body: { status: (typeof USER_ACCOUNT_STATUS)[number] };
// }>;

export const bulkDeleteZod = z.object({
  body: z.object({
    ids: z
      .array(z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid User ID format"))
      .min(1, "Please provide at least one user ID"),
  }),
}) satisfies z.ZodType<{
  body: { ids: string[] };
}>;

export const deleteUserZod = z.object({
  body: z.object({
    password: z.string({
      message: "Password is required to confirm deletion",
    }),
  }),
}) satisfies z.ZodType<{
  body: Pick<UserDto, "password">;
}>;
const deactivateUserZod = z.object({
  body: z.object({
    password: z.string({
      message: "Password is required to confirm deactivation",
    }),
  }),
});

// export type UpdateUser = z.infer<typeof updateUserSchema>["body"];
// export type UpdateStatus = z.infer<typeof updateStatusSchema>["body"];
export type BulkDelete = z.infer<typeof bulkDeleteZod>["body"];
// export type DefaultUser = z.infer<typeof userSchema>;
export type DeleteUser = z.infer<typeof deleteUserZod>["body"];
type DeactivateUserInput = z.infer<typeof deactivateUserZod>["body"];
export type DeleteUserInput = z.infer<typeof deleteUserZod>["body"];
