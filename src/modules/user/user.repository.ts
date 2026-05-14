import { Prisma } from "../../../generated/prisma/client.js";
import { prisma } from "../../config/prisma.js";

export async function findAll(page = 1, limit = 20) {
  return await prisma.user.findMany({
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { createdAt: "desc" },
  });
}

export async function create(user: Prisma.UserCreateInput) {
  return await prisma.user.create({
    data: user,
  });
}

export async function findByEmail(userEmail: string) {
  return await prisma.user.findUnique({
    where: {
      email: userEmail,
    },
  });
}

export async function update(userId: string, user: Prisma.UserUpdateInput) {
  return await prisma.user.update({
    where: {
      id: userId,
    },

    data: user,
  });
}

export async function findById(userId: string) {
  return await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
}

export async function deleteById(userId: string) {
  return await prisma.user.delete({
    where: {
      id: userId,
    },
  });
}
