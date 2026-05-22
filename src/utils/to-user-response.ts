import { User } from "@prisma/client";
import { UserResponseDto } from "../modules/user/user.dto.js";

export default function toUserResponse(user: User): UserResponseDto {
  const { passwordHash, deletedAt, ...safeUser } = user;
  return safeUser;
}
