import {
  generateAccessToken,
  generateRefreshToken,
  JwtPayload,
  verifyRefreshToken,
} from "../../config/jwt.js";
import {
  AuthResponseDto,
  LoginDto,
  RegisterDto,
  TokenResponseDto,
} from "./auth.dto.js";
import * as authRepository from "./auth.repository.js";
import * as userRepository from "../user/user.repository.js";
import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "../../common/errors/index.js";
import * as bcrypt from "bcrypt";
import toUserResponse from "../../utils/to-user-response.js";
import { User } from "@prisma/client";

function toAuthResponse(user: User, accesToken: string, refreshToken: string) {
  return {
    tokens: {
      accessToken: accesToken,
      refreshToken: refreshToken,
    },
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    },
  };
}

export async function login(loginDto: LoginDto): Promise<AuthResponseDto> {
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

  return toAuthResponse(user, accessToken, refreshToken);
}

export async function logout(refreshToken: string): Promise<string> {
  const storedToken = await authRepository.findRefreshToken(refreshToken);

  if (!storedToken || storedToken.expiresAt < new Date())
    throw new UnauthorizedError("Invalid refresh token ");

  await authRepository.deleteRefreshToken(refreshToken);

  return "Successful logout";
}

export async function register(
  createUserDto: RegisterDto,
): Promise<AuthResponseDto> {
  const existingUser = await userRepository.findByEmail(createUserDto.email);
  if (existingUser)
    throw new ConflictError(
      `user with email : ${createUserDto.email} already exists`,
    );

  const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

  const createdUser = await userRepository.create({
    email: createUserDto.email,
    firstName: createUserDto.firstName,
    lastName: createUserDto.lastName,
    passwordHash: hashedPassword,
  });

  const tokenPayload: JwtPayload = {
    userId: createdUser.id,
    role: createdUser.role,
  };

  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  await authRepository.saveRefreshToken({
    userId: createdUser.id,
    token: refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  const userRegisterResponse = {
    data: toUserResponse(createdUser),
    tokens: {
      accessToken,
      refreshToken,
    },
  };

  return toAuthResponse(createdUser, accessToken, refreshToken);
}

export async function getProfile(userId: string) {
  const existingUser = await userRepository.findById(userId);
  if (!existingUser) throw new NotFoundError("user");

  return toUserResponse(existingUser);
}

export async function refreshToken(
  actualRefreshToken: string,
): Promise<TokenResponseDto> {
  const storedRefreshToken =
    await authRepository.findRefreshToken(actualRefreshToken);
  if (!storedRefreshToken || storedRefreshToken.expiresAt < new Date())
    throw new UnauthorizedError("Invalid refresh token");

  const decoded = verifyRefreshToken(actualRefreshToken);

  const payload: JwtPayload = {
    userId: decoded.userId,
    role: decoded.role,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  await authRepository.deleteRefreshToken(actualRefreshToken);

  await authRepository.saveRefreshToken({
    userId: payload.userId,
    token: refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  return {
    accessToken,
    refreshToken,
  };
}
