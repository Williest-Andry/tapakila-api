import z from "zod";
import { UserRole } from "../../../generated/prisma/enums.js";

export const CreateUserSchema = z.object({
  email: z.email("Invalid email"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  password: z.string().min(8, "At least 8 characters is required for password"),
});

export const UpdateUserByAdminSchema = z.object({
  email: z.email("Invalid email").optional(),
  firstName: z.string().min(1, "At least one character is required").optional(),
  lastName: z.string().min(1, "At least one character is required").optional(),
  role: z.enum(["USER", "ORGANISER", "ADMIN"]).optional(),
});

export const UpdateUserSchema = z.object({
  email: z.email("Invalid email").optional(),
  firstName: z.string().min(1, "At least one character is required").optional(),
  lastName: z.string().min(1, "At least one character is required").optional(),
});

export type CreateUserDto = z.infer<typeof CreateUserSchema>;
export type UpdateUserByAdminDto = z.infer<typeof UpdateUserByAdminSchema>;
export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;

export interface UserResponseDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  role: UserRole;
}
