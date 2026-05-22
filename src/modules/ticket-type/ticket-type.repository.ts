import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma.js";

export type TicketTypeWithAvailability = Prisma.TicketTypeGetPayload<{}> & {
  availableSeats: number;
};

async function computeAvailableSeats(
  ticketTypeId: string,
  totalSeats: number,
): Promise<number> {
  const booked = await prisma.bookingItem.aggregate({
    where: {
      ticketTypeId,
      booking: { status: "CONFIRMED" },
    },
    _sum: { quantity: true },
  });
  return totalSeats - (booked._sum.quantity ?? 0);
}

export async function findAllByEventId(
  eventId: string,
): Promise<TicketTypeWithAvailability[]> {
  const ticketTypes = await prisma.ticketType.findMany({
    where: { eventId },
    orderBy: { createdAt: "asc" },
  });

  return Promise.all(
    ticketTypes.map(async (tt) => ({
      ...tt,
      availableSeats: await computeAvailableSeats(tt.id, tt.totalSeats),
    })),
  );
}

export async function findById(
  ticketTypeId: string,
): Promise<TicketTypeWithAvailability | null> {
  const tt = await prisma.ticketType.findUnique({
    where: { id: ticketTypeId },
  });
  if (!tt) return null;
  return {
    ...tt,
    availableSeats: await computeAvailableSeats(tt.id, tt.totalSeats),
  };
}

export async function findByName(
  ticketTypeName: string,
): Promise<TicketTypeWithAvailability | null> {
  const tt = await prisma.ticketType.findFirst({
    where: { name: ticketTypeName },
  });
  if (!tt) return null;
  return {
    ...tt,
    availableSeats: await computeAvailableSeats(tt.id, tt.totalSeats),
  };
}

export async function create(
  data: Prisma.TicketTypeUncheckedCreateInput,
): Promise<TicketTypeWithAvailability> {
  const tt = await prisma.ticketType.create({ data });
  return { ...tt, availableSeats: tt.totalSeats };
}

export async function update(
  ticketTypeId: string,
  data: Prisma.TicketTypeUpdateInput,
): Promise<TicketTypeWithAvailability> {
  const tt = await prisma.ticketType.update({
    where: { id: ticketTypeId },
    data,
  });
  return {
    ...tt,
    availableSeats: await computeAvailableSeats(tt.id, tt.totalSeats),
  };
}

export async function deactivateAllForEvent(eventId: string) {
  return await prisma.ticketType.updateMany({
    where: { eventId },
    data: { isActive: false },
  });
}
