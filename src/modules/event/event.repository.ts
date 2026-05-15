import { Prisma } from "../../../generated/prisma/client.js";
import { prisma } from "../../config/prisma.js";

export async function findAll(
  userId: string,
  userRole: string,
  page = 1,
  limit = 10,
) {
  const where: Prisma.EventWhereInput = {};

  if (!userRole || userRole === "USER") {
    where.status = "PUBLISHED";
  }

  if (userRole === "ORGANIZER") {
    where.OR = [{ status: "PUBLISHED" }, { organizerId: userId }];
  }

  return prisma.event.findMany({
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { createdAt: "desc" },
    where: where,
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      organizer: {
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
        },
      },
      ticketTypes: {
        select: {
          id: true,
          name: true,
          price: true,
          totalSeats: true,
          maxPerUser: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  });
}
