import {
  generateAccessToken,
  generateRefreshToken,
  JwtPayload,
} from "../../config/jwt.js";
import { LoginDto, TokenResponseDto } from "./auth.dto.js";
import * as authRepository from "./auth.repository.js";
import * as userRepository from "../user/user.repository.js";
import { NotFoundError, UnauthorizedError } from "../../common/errors/index.js";
import * as bcrypt from "bcrypt";

export async function login(loginDto: LoginDto): Promise<TokenResponseDto> {
  const user = await userRepository.findByEmail(loginDto.email);
  if (!user) throw new NotFoundError(`User with email : ${loginDto.email}`);

  const isValid = await bcrypt.compare(loginDto.password, user.passwordHash);
  if (!isValid) throw new UnauthorizedError("Incorrect password");

  const payload: JwtPayload = { userId: user.id, role: user.role };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  await authRepository.saveRefreshToken({
    userId: user.id,
    token: refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  return { accessToken, refreshToken };
}
