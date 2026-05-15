import * as eventRepository from "./event.repository.js";
import { UserRole } from "../../../generated/prisma/enums.js";
import { EventResponseDto } from "./event.dto.js";

export function toEventResponse(event: any): EventResponseDto {
  const responseEvent = {
    id: event.event.id,
    title: event.title,
    description: event.description,
    location: event.location,
    eventDate: event.eventDate,
    imageUrl: event.imageUrl,
    status: event.status,
    createdAt: event.createdAt,
    updatedAt: event.updatedAt,
    category: {
      id: event.category.id,
      name: event.category.name,
    },
    organizer: {
      id: event.organizer.id,
      email: event.organizer.email,
      firstName: event.organizer.firstName,
      lastName: event.organizer.lastName,
    },
    ticketTypes: event.ticketTypes.map((ticketType: any) => ({
      id: ticketType.id,
      name: ticketType.name,
      price: ticketType.price,
      totalSeats: ticketType.totalSeats,
      maxPerUser: ticketType.maxPerUser,
      isActive: ticketType.isActive,
      createdAt: ticketType.createdAt,
      updatedAt: ticketType.updatedAt,
    })),
  };

  return responseEvent;
}

export async function findAll(
  userId: string,
  userRole: UserRole,
  page?: number,
  limit?: number,
): Promise<EventResponseDto[]> {
  const events = await eventRepository.findAll(userId, userRole, page, limit);

  const responseEvents = events.map(toEventResponse);

  return responseEvents;
}
