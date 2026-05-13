import { Prisma } from "../../../generated/prisma/client.js";
import { prisma } from "../../config/prisma.js";

export function saveRefreshToken(refreshToken: Prisma.RefreshTokenUncheckedCreateInput) {
  return prisma.refreshToken.create({
    data: refreshToken,
  });
}
