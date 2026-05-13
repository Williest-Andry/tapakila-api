import z from "zod";

export const LoginSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

export const TokenResponseSchema = z.object({
  accessToken: z.jwt(),
  refreshToken: z.jwt(),
});

export type LoginDto = z.infer<typeof LoginSchema>;
export type TokenResponseDto = z.infer<typeof TokenResponseSchema>;
