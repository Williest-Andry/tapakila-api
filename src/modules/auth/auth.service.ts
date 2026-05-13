import {
  generateAccessToken,
  generateRefreshToken,
  JwtPayload,
} from "../../config/jwt.js";
import {
  LoginDto,
  ProfileDto,
  RegisterDto,
  RegisterResponseDto,
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

export async function logout(
  userId: string,
  refreshToken: string,
): Promise<string> {
  const storedToken = await authRepository.findRefreshToken(refreshToken);

  if (!storedToken) throw new UnauthorizedError("Invalid refresh token ");

  await authRepository.deleteRefreshTokenByUserId(userId);

  return "Successful logout";
}

export async function register(
  createUserDto: RegisterDto,
): Promise<RegisterResponseDto> {
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

  const savedRefreshToken = await authRepository.saveRefreshToken({
    userId: createdUser.id,
    token: refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  const userRegisterResponse = {
    data: {
      email: createUserDto.email,
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
    },
    tokens: {
      accessToken: accessToken,
      refreshToken: savedRefreshToken.token,
    },
  };

  return userRegisterResponse;
}

export async function getProfile(userId: string): Promise<ProfileDto> {
  const existingUser = await userRepository.findById(userId);
  if (!existingUser) throw new NotFoundError("user");

  const userProfile: ProfileDto = {
    email: existingUser.email,
    firstName: existingUser.firstName,
    lastName: existingUser.lastName,
    createdAt: existingUser.createdAt,
    role: existingUser.role,
  };

  return userProfile;
}
