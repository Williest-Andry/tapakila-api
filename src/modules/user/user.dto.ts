import z from "zod";

export const CreateUserSchema = z.object({
  email: z.email("Invalid email"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  password: z.string().min(8, "At least 8 characters is required for password")
});

export const UpdateUserSchema = z.object({
  email: z.email("Invalid email").optional(),
  firstName: z.string().min(1, "At least one character is required").optional(),
  lastName: z.string().min(1, "At least one character is required").optional(),
});

export type CreateUserDto = z.infer<typeof CreateUserSchema>;
export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;
export interface UserResponseDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
}
