import z from "zod";

export const LoginSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

export const RegisterSchema = z.object({
  email: z.email("Invalid email"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  password: z.string().min(8, "At least 8 characters is required for password"),
});

export const RefreshTokensSchema = z.object({
  refreshToken: z.jwt(),
});

export type LoginDto = z.infer<typeof LoginSchema>;
export type LogoutDto = z.infer<typeof RefreshTokensSchema>;
export type RegisterDto = z.infer<typeof RegisterSchema>;
export type RefreshTokensDto = z.infer<typeof RefreshTokensSchema>;

export type TokenResponseDto = {
  accessToken: string;
  refreshToken: string;
};
export type RegisterResponseDto = {
  data: {
    email: string;
    firstName: string;
    lastName: string;
  };
  tokens: TokenResponseDto;
};
