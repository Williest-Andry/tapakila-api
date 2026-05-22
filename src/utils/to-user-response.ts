import { User } from "../generated/prisma/client.js";
import { UserResponseDto } from "../modules/user/user.dto.js";

export default function toUserResponse(user: User): UserResponseDto {
  const { passwordHash, deletedAt, ...safeUser } = user;
  return safeUser;
}
