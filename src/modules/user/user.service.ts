import { Prisma, User } from "../../../generated/prisma/client.js";
import { ConflictError } from "../../common/errors/index.js";
import { CreateUserDto, UserResponseDto } from "./user.dto.js";
import * as userRepository from "./user.repository.js";

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

export async function create(userDto: CreateUserDto): Promise<UserResponseDto> {
  const existingUser = await findByEmail(userDto.email);
  if (existingUser) {
    throw new ConflictError(`user with email ${userDto.email}`);
  }

  const user: Prisma.UserCreateInput = {
    email: userDto.email,
    passwordHash: "[IMPORTANT] vo ho atao",
    firstName: userDto.firstName,
    lastName: userDto.lastName,
  };

  const createdUser = await userRepository.create(user);

  return toUserResponse(createdUser);
}
