import { Prisma, User } from "../../../generated/prisma/client.js";
import { ConflictError, NotFoundError } from "../../common/errors/index.js";
import { CreateUserDto, UpdateUserDto, UserResponseDto } from "./user.dto.js";
import * as userRepository from "./user.repository.js";
import * as bcrypt from "bcrypt";

export async function findAll() {
  return await userRepository.findAll();
}

function toUserResponse(user: User): UserResponseDto {
  const { passwordHash, ...safeUser } = user;
  return safeUser;
}

export async function findByEmail(userEmail: string) {
  return await userRepository.findByEmail(userEmail);
}

export async function findById(userId: string): Promise<UserResponseDto> {
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new NotFoundError(`user with id ${userId}`);
  }

  return toUserResponse(user);
}

export async function create(userDto: CreateUserDto): Promise<UserResponseDto> {
  const existingUser = await findByEmail(userDto.email);
  if (existingUser) {
    throw new ConflictError(`user with email ${userDto.email}`);
  }

  const hashedPassword = await bcrypt.hash(userDto.password, 10);

  const user: Prisma.UserCreateInput = {
    email: userDto.email,
    passwordHash: hashedPassword,
    firstName: userDto.firstName,
    lastName: userDto.lastName,
  };

  const createdUser = await userRepository.create(user);

  return toUserResponse(createdUser);
}

export async function update(
  userId: string,
  userDto: UpdateUserDto,
): Promise<UserResponseDto> {
  const existingUser = await findById(userId);
  if (!existingUser) {
    throw new NotFoundError(`user with id ${userId}`);
  }

  if (userDto.email) {
    const existingUserWithEmail = await findByEmail(userDto.email);
    if (existingUserWithEmail && existingUserWithEmail.id !== existingUser.id) {
      throw new ConflictError(`user with email ${userDto.email}`);
    }
  }

  const user: Prisma.UserUpdateInput = {
    email: userDto.email,
    firstName: userDto.firstName,
    lastName: userDto.lastName,
  };

  const updatedUser = await userRepository.update(userId, user);

  return toUserResponse(updatedUser);
}

export async function deleteById(userId: string): Promise<UserResponseDto> {
  const existingUser = await findById(userId);
  if (!existingUser) {
    throw new NotFoundError(`user with id ${userId}`);
  }

  const deletedUser = await userRepository.deleteById(userId);

  return toUserResponse(deletedUser);
}
