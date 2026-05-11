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
