import { Prisma } from "../../../generated/prisma/client.js";
import { prisma } from "../../config/prisma.js";

export async function findAll(page = 1, limit = 10) {
  return prisma.eventCategory.findMany({
    skip: (page - 1) * limit,
    take: limit,
  });
}

export async function create(eventCategory: Prisma.EventCategoryCreateInput) {
  return prisma.eventCategory.create({
    data: eventCategory,
  });
}
