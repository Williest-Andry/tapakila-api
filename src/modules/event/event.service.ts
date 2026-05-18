import * as eventRepository from "./event.repository.js";
import { EventStatus, UserRole } from "../../../generated/prisma/enums.js";
import {
  CreateEventDto,
  EventResponseDto,
  UpdateEventStatusDto,
} from "./event.dto.js";
import * as categoryRepository from "./category.repository.js";
import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
} from "../../common/errors/index.js";
import * as userRepository from "../user/user.repository.js";
import { Prisma } from "../../../generated/prisma/client.js";
import AppError from "../../utils/AppError.js";

function toEventResponse(
  event: eventRepository.EventWithRelations,
): EventResponseDto {
  const responseEvent = {
    id: event.id,
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
    ticketTypes: event.ticketTypes.map((ticketType) => ({
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

export async function create(
  organizerId: string,
  createEventDto: CreateEventDto,
): Promise<EventResponseDto> {
  try {
    const existingCategory = await categoryRepository.findById(
      createEventDto.category.id,
    );
    if (!existingCategory)
      throw new NotFoundError(
        `event category with id : ${createEventDto.category.id}`,
      );

    const existingOrganizer = await userRepository.findById(organizerId);
    if (!existingOrganizer)
      throw new NotFoundError(`organizer with id : ${organizerId}`);

    const eventToCreate = {
      title: createEventDto.title,
      description: createEventDto.description,
      location: createEventDto.location,
      eventDate: createEventDto.eventDate,
      imageUrl: createEventDto.imageUrl,
      category: {
        connect: {
          id: createEventDto.category.id,
        },
      },
      organizer: {
        connect: {
          id: organizerId,
        },
      },
    };

    const createdEvent = await eventRepository.create(eventToCreate);

    return toEventResponse(createdEvent);
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2002"
    ) {
      throw new ConflictError(
        "You already have created event with the same title, date and location",
      );
    }

    throw new AppError("Unexpected internal error", 500);
  }
}

const allowedEventStatusTransitions: Record<EventStatus, EventStatus[]> = {
  DRAFT: ["PUBLISHED", "CANCELLED"],
  PUBLISHED: ["DRAFT", "CANCELLED"],
  CANCELLED: [],
};

export async function updateStatus(
  eventId: string,
  eventStatusDto: UpdateEventStatusDto,
  userId: string,
  userRole: UserRole,
) {
  const event = await eventRepository.findById(eventId);
  if (!event) throw new NotFoundError(`event with id : ${eventId}`);

  if (userRole === UserRole.ORGANIZER && event.organizerId !== userId) {
    throw new ForbiddenError();
  }

  const allowedStatus = allowedEventStatusTransitions[event.status];
  if (!allowedStatus.includes(eventStatusDto.status)) {
    throw new BadRequestError(
      `Cannot transition from ${event.status} to ${eventStatusDto.status}`,
    );
  }

  // pub -> can => cancelled bookings and ticket

  // pub -> draft => not allowed if bookings exist

  event.status = eventStatusDto.status;

  const updatedEvent = await eventRepository.update(eventId, event);

  return toEventResponse(updatedEvent);
}
