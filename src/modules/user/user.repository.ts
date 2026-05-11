import { Prisma } from "../../../generated/prisma/client.js";
import { prisma } from "../../config/prisma.js";

export async function findAll() {
  return await prisma.user.findMany();
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
