import { Prisma } from "../../../generated/prisma/client.js";
import { prisma } from "../../config/prisma.js";

export async function saveRefreshToken(
  refreshToken: Prisma.RefreshTokenUncheckedCreateInput,
) {
  return await prisma.refreshToken.create({
    data: refreshToken,
  });
}

export async function findRefreshToken(refreshToken: string) {
  return await prisma.refreshToken.findFirst({
    where: {
      token: refreshToken,
    },
  });
}

export async function deleteRefreshTokenByUserId(userId: string) {
  return await prisma.refreshToken.deleteMany({
    where: {
      userId: userId,
    },
  });
}
