import { Prisma } from "../../../generated/prisma/client.js";
import { prisma } from "../../config/prisma.js";
import { BookingFiltersDto } from "./booking.dto.js";

const bookingWithRelations = {
  include: {
    event: {
      select: { id: true, title: true, eventDate: true },
    },
    user: {
      select: { id: true, email: true, firstName: true, lastName: true },
    },
    bookingItems: {
      include: {
        ticketType: {
          select: { id: true, name: true },
        },
      },
    },
  },
};

export type BookingWithRelations = Prisma.BookingGetPayload<
  typeof bookingWithRelations
>;

export async function findAll(
  requesterId: string,
  requesterRole: string,
  filters: BookingFiltersDto,
): Promise<BookingWithRelations[]> {
  let where = {};

  if (requesterRole === "USER") {
    where = { userId: requesterId };
  } else if (requesterRole === "ORGANIZER") {
    where = { event: { organizerId: requesterId } };
  }

  return await prisma.booking.findMany({
    where: {
      ...where,
      ...(filters.eventId ? { eventId: filters.eventId } : {}),
      ...(filters.status ? { status: filters.status } : {}),
    },
    include: bookingWithRelations.include,
    orderBy: { createdAt: "desc" },
    skip: (filters.page - 1) * filters.limit,
    take: filters.limit,
  });
}

export async function findById(
  bookingId: string,
): Promise<BookingWithRelations | null> {
  return await prisma.booking.findUnique({
    where: { id: bookingId },
    include: bookingWithRelations.include,
  });
}

export async function create(
  data: Prisma.BookingUncheckedCreateInput,
): Promise<BookingWithRelations> {
  return await prisma.booking.create({
    data,
    include: bookingWithRelations.include,
  });
}

export async function cancel(bookingId: string): Promise<BookingWithRelations> {
  return await prisma.booking.update({
    where: { id: bookingId },
    data: { status: "CANCELLED" },
    include: bookingWithRelations.include,
  });
}

export async function cancelAllForEvent(eventId: string) {
  return await prisma.booking.updateMany({
    where: { eventId, status: "CONFIRMED" },
    data: { status: "CANCELLED" },
  });
}

export async function existsForEvent(eventId: string): Promise<boolean> {
  const count = await prisma.booking.count({
    where: { eventId, status: "CONFIRMED" },
  });

  return count > 0;
}

export async function countUserTicketsForType(
  userId: string,
  ticketTypeId: string,
): Promise<number> {
  const result = await prisma.bookingItem.aggregate({
    where: {
      ticketTypeId,
      booking: { userId, status: "CONFIRMED" },
    },
    _sum: { quantity: true },
  });

  return result._sum.quantity ?? 0;
}
