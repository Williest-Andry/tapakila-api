import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma.js";
import { UserFiltersDto } from "./user.dto.js";

export async function findAll(filters: UserFiltersDto) {
  const where: Prisma.UserWhereInput = {};

  if (filters.firstName) {
    where.firstName = {
      contains: filters.firstName,
      mode: "insensitive",
    };
  }

  if (filters.lastName) {
    where.lastName = {
      contains: filters.lastName,
      mode: "insensitive",
    };
  }

  if (filters.role) {
    where.role = filters.role;
  }

  where.isActive = filters.isActive;

  return await prisma.user.findMany({
    where,
    skip: (filters.page - 1) * filters.limit,
    take: filters.limit,
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

export async function deactivate(userId: string) {
  return await prisma.user.update({
    where: { id: userId },
    data: {
      isActive: false,
      deletedAt: new Date(),
      email: `deleted_${userId}@deleted.com`,
    },
  });
}
