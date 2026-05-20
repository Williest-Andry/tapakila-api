import { prisma } from "../../config/prisma.js";
import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
} from "../../common/errors/index.js";
import * as bookingRepository from "./booking.repository.js";
import * as eventRepository from "../event/event.repository.js";
import {
  BookingResponseDto,
  CreateBookingDto,
  ReservationFiltersDto,
  UpdateBookingItemDto,
} from "./booking.dto.js";
import { BookingWithRelations } from "./booking.repository.js";
import { Prisma } from "../../../generated/prisma/client.js";
import AppError from "../../utils/AppError.js";
import * as ticketTypeRepository from "../ticket-type/ticket-type.repository.js";

function toBookingResponse(booking: BookingWithRelations): BookingResponseDto {
  const items = booking.bookingItems.map((item) => ({
    id: item.id,
    quantity: item.quantity,
    unitPrice: Number(item.unitPrice),
    ticketTypeId: item.ticketType.id,
    ticketTypeName: item.ticketType.name,
  }));

  const totalPrice = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  );

  return {
    id: booking.id,
    status: booking.status,
    createdAt: booking.createdAt,
    updatedAt: booking.updatedAt,
    eventId: booking.event.id,
    eventTitle: booking.event.title,
    eventDate: booking.event.eventDate,
    userId: booking.user.id,
    items,
    totalPrice,
  };
}

export async function findAll(
  requesterId: string,
  requesterRole: string,
  filters: ReservationFiltersDto,
): Promise<BookingResponseDto[]> {
  const bookings = await bookingRepository.findAll(
    requesterId,
    requesterRole,
    filters,
  );

  return bookings.map(toBookingResponse);
}

export async function findById(
  bookingId: string,
  requesterId: string,
  requesterRole: string,
): Promise<BookingResponseDto> {
  const booking = await bookingRepository.findById(bookingId);
  if (!booking) throw new NotFoundError(`Booking with id ${bookingId}`);

  if (requesterRole === "USER" && booking.user.id !== requesterId) {
    throw new ForbiddenError();
  }

  if (requesterRole === "ORGANIZER") {
    const event = await eventRepository.findById(booking.eventId);
    if (event?.organizerId !== requesterId) throw new ForbiddenError();
  }

  return toBookingResponse(booking);
}

export async function create(
  userId: string,
  dto: CreateBookingDto,
): Promise<BookingResponseDto> {
  const event = await eventRepository.findById(dto.eventId);
  if (!event) throw new NotFoundError(`Event with id ${dto.eventId}`);
  if (event.status !== "PUBLISHED") {
    throw new BadRequestError("Event is not available for booking");
  }

  try {
    const booking = await prisma.$transaction(async (tx) => {
      const bookingItemsData: {
        ticketTypeId: string;
        quantity: number;
        unitPrice: number;
      }[] = [];

      for (const item of dto.items) {
        const ticketType = await tx.ticketType.findUnique({
          where: { id: item.ticketTypeId },
        });

        if (!ticketType) {
          throw new NotFoundError(`TicketType with id ${item.ticketTypeId}`);
        }
        if (ticketType.eventId !== dto.eventId) {
          throw new BadRequestError(
            `TicketType ${item.ticketTypeId} does not belong to this event`,
          );
        }
        if (!ticketType.isActive) {
          throw new BadRequestError(
            `Ticket type "${ticketType.name}" is no longer available`,
          );
        }

        const alreadyBooked = await bookingRepository.countUserTicketsForType(
          userId,
          item.ticketTypeId,
        );
        if (alreadyBooked + item.quantity > ticketType.maxPerUser) {
          throw new BadRequestError(
            `Maximum ${ticketType.maxPerUser} tickets of type "${ticketType.name}" per user`,
          );
        }

        const bookedSeats = await tx.bookingItem.aggregate({
          where: {
            ticketTypeId: item.ticketTypeId,
            booking: { status: "CONFIRMED" },
          },
          _sum: { quantity: true },
        });
        const availableSeats =
          ticketType.totalSeats - (bookedSeats._sum.quantity ?? 0);
        if (availableSeats < item.quantity) {
          throw new BadRequestError(
            `Not enough seats for ticket type "${ticketType.name}" (${availableSeats} remaining)`,
          );
        }

        bookingItemsData.push({
          ticketTypeId: item.ticketTypeId,
          quantity: item.quantity,
          unitPrice: Number(ticketType.price),
        });
      }

      return await tx.booking.create({
        data: {
          userId,
          eventId: dto.eventId,
          status: "CONFIRMED",
          bookingItems: {
            create: bookingItemsData.map((item) => ({
              ticketTypeId: item.ticketTypeId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
            })),
          },
        },
        include: {
          event: { select: { id: true, title: true, eventDate: true } },
          user: {
            select: { id: true, email: true, firstName: true, lastName: true },
          },
          bookingItems: {
            include: { ticketType: { select: { id: true, name: true } } },
          },
        },
      });
    });

    return toBookingResponse(booking);
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2002"
    ) {
      throw new ConflictError(
        "You already made a booking for this event. Modify the booking quantity instead. This booking",
      );
    }

    throw new AppError("Unexpected internal error", 500);
  }
}

export async function cancel(
  bookingId: string,
  requesterId: string,
  requesterRole: string,
): Promise<BookingResponseDto> {
  const booking = await bookingRepository.findById(bookingId);
  if (!booking) throw new NotFoundError(`Booking with id ${bookingId}`);

  if (requesterRole === "USER" && booking.user.id !== requesterId) {
    throw new ForbiddenError();
  }

  if (booking.status === "CANCELLED") {
    throw new BadRequestError("Booking is already cancelled");
  }

  if (booking.event.eventDate < new Date()) {
    throw new BadRequestError("Cannot cancel a booking for a past event");
  }

  const cancelled = await bookingRepository.cancel(bookingId);

  return toBookingResponse(cancelled);
}

export async function updateItem(
  bookingId: string,
  requesterId: string,
  dto: UpdateBookingItemDto,
): Promise<BookingResponseDto> {
  const booking = await bookingRepository.findById(bookingId);
  if (!booking) throw new NotFoundError(`Booking with id ${bookingId}`);

  if (booking.user.id !== requesterId) throw new ForbiddenError();

  if (booking.status === "CANCELLED") {
    throw new BadRequestError("Cannot modify a cancelled booking");
  }

  if (booking.event.eventDate < new Date()) {
    throw new BadRequestError("Cannot modify a booking for a past event");
  }

  const updated = await prisma.$transaction(async (tx) => {
    const bookingItem = await tx.bookingItem.findFirst({
      where: { bookingId, ticketTypeId: dto.ticketTypeId },
    });
    if (!bookingItem) {
      throw new NotFoundError(
        `TicketType with id: ${dto.ticketTypeId} in this booking`,
      );
    }

    const ticketType = await tx.ticketType.findUnique({
      where: { id: dto.ticketTypeId },
    });
    if (!ticketType || !ticketType.isActive) {
      throw new BadRequestError("Ticket type is no longer available");
    }

    const diff = dto.quantity - bookingItem.quantity;

    if (diff > 0) {
      const bookedSeats = await tx.bookingItem.aggregate({
        where: {
          ticketTypeId: dto.ticketTypeId,
          booking: { status: "CONFIRMED" },
        },
        _sum: { quantity: true },
      });
      const availableSeats =
        ticketType.totalSeats - (bookedSeats._sum.quantity ?? 0);

      if (availableSeats < diff) {
        throw new BadRequestError(
          `Not enough seats available (${availableSeats} remaining)`,
        );
      }

      const totalAfterUpdate = bookingItem.quantity + diff;
      if (totalAfterUpdate > ticketType.maxPerUser) {
        throw new BadRequestError(
          `Maximum ${ticketType.maxPerUser} tickets of type "${ticketType.name}" per user`,
        );
      }
    }

    await tx.bookingItem.update({
      where: { id: bookingItem.id },
      data: { quantity: dto.quantity },
    });

    return await tx.booking.update({
      where: { id: bookingId },
      data: { updatedAt: new Date() },
      include: {
        event: { select: { id: true, title: true, eventDate: true } },
        user: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
        bookingItems: {
          include: { ticketType: { select: { id: true, name: true } } },
        },
      },
    });
  });

  return toBookingResponse(updated);
}
