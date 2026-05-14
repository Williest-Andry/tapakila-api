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
  return await prisma.refreshToken.findUnique({
    where: {
      token: refreshToken,
    },
  });
}

export async function deleteRefreshToken(refreshToken: string) {
  return await prisma.refreshToken.delete({
    where: {
      token: refreshToken,
    },
  });
}
