import { Prisma } from "../../../generated/prisma/client.js";
import { prisma } from "../../config/prisma.js";
import { EventFiltersDto } from "./event.dto.js";

const eventWithRelations = {
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
} satisfies Prisma.EventDefaultArgs;

export type EventWithRelations = Prisma.EventGetPayload<
  typeof eventWithRelations
>;

export async function findAll(
  userId: string | null,
  userRole: string | null,
  filters: EventFiltersDto,
) {
  const where: Prisma.EventWhereInput = {};

  if (userRole === "ADMIN") {
  } else if (userRole === "ORGANIZER" && userId) {
    where.OR = [
      { status: filters.status ?? "PUBLISHED" },
      { organizerId: userId },
    ];
  } else {
    where.status = "PUBLISHED";
  }

  if (userRole === "ADMIN" && filters.status) {
    where.status = filters.status;
  }

  if (filters.search) {
    const searchCondition: Prisma.EventWhereInput = {
      OR: [
        { title: { contains: filters.search, mode: "insensitive" } },
        { description: { contains: filters.search, mode: "insensitive" } },
        { location: { contains: filters.search, mode: "insensitive" } },
      ],
    };
    where.AND = [searchCondition];
  }

  if (filters.categoryId) where.categoryId = filters.categoryId;
  if (filters.organizerId) where.organizerId = filters.organizerId;
  if (filters.location) {
    where.location = { contains: filters.location, mode: "insensitive" };
  }

  if (filters.dateFrom || filters.dateTo) {
    where.eventDate = {
      ...(filters.dateFrom ? { gte: filters.dateFrom } : {}),
      ...(filters.dateTo ? { lte: filters.dateTo } : {}),
    };
  }

  if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
    where.ticketTypes = {
      some: {
        isActive: true,
        price: {
          ...(filters.priceMin !== undefined ? { gte: filters.priceMin } : {}),
          ...(filters.priceMax !== undefined ? { lte: filters.priceMax } : {}),
        },
      },
    };
  }

  return prisma.event.findMany({
    where,
    skip: (filters.page - 1) * filters.limit,
    take: filters.limit,
    orderBy: { [filters.sortBy]: filters.sortOrder },
    include: eventWithRelations.include,
  });
}

export async function findById(eventId: string) {
  return prisma.event.findUnique({
    where: {
      id: eventId,
    },
  });
}

export async function create(event: Prisma.EventCreateInput) {
  return prisma.event.create({
    data: event,
    include: eventWithRelations.include,
  });
}

export async function update(eventId: string, event: Prisma.EventUpdateInput) {
  return prisma.event.update({
    where: {
      id: eventId,
    },
    data: event,
    include: eventWithRelations.include,
  });
}
