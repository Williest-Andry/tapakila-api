import z from "zod";

export const LoginSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

export const TokenResponseSchema = z.object({
  accessToken: z.jwt(),
  refreshToken: z.jwt(),
});

export const LogoutSchema = z.object({
  refreshToken: z.jwt(),
});

export const RegisterSchema = z.object({
  email: z.email("Invalid email"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  password: z.string().min(8, "At least 8 characters is required for password"),
});

export const RegisterResponseSchema = z.object({
  data: z.object({
    email: z.email(),
    firstName: z.string(),
    lastName: z.string(),
  }),
  tokens: z.object({
    accessToken: z.jwt(),
    refreshToken: z.jwt(),
  }),
});

export const ProfileSchema = z.object({
  email: z.email(),
  firstName: z.string(),
  lastName: z.string(),
  createdAt: z.date(),
  role: z.enum(["ADMIN", "ORGANIZER", "USER"]),
});

export const RefreshTokensSchema = z.object({
  refreshToken: z.jwt(),
});

export type LoginDto = z.infer<typeof LoginSchema>;
export type TokenResponseDto = z.infer<typeof TokenResponseSchema>;
export type LogoutDto = z.infer<typeof LogoutSchema>;
export type RegisterDto = z.infer<typeof RegisterSchema>;
export type RegisterResponseDto = z.infer<typeof RegisterResponseSchema>;
export type ProfileDto = z.infer<typeof ProfileSchema>;
export type RefreshTokensDto = z.infer<typeof RefreshTokensSchema>;
