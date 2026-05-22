import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma.js";

export async function findAll(page = 1, limit = 10) {
  return prisma.eventCategory.findMany({
    skip: (page - 1) * limit,
    take: limit,
  });
}

export async function findById(id: string) {
  return prisma.eventCategory.findUnique({
    where: {
      id: id,
    },
  });
}

export async function findByName(name: string) {
  return prisma.eventCategory.findUnique({
    where: {
      name: name,
    },
  });
}

export async function create(eventCategory: Prisma.EventCategoryCreateInput) {
  return prisma.eventCategory.create({
    data: eventCategory,
  });
}
