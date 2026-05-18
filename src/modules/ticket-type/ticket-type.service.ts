import { Prisma } from "../../../generated/prisma/client.js";
import {
  NotFoundError,
  ForbiddenError,
  BadRequestError,
  ConflictError,
} from "../../common/errors/index.js";
import * as ticketTypeRepository from "./ticket-type.repository.js";
import * as eventRepository from "../event/event.repository.js";
import {
  CreateTicketTypeDto,
  UpdateTicketTypeDto,
  TicketTypeResponseDto,
} from "./ticket-type.dto.js";
import { TicketTypeWithAvailability } from "./ticket-type.repository.js";

function toTicketTypeResponse(
  tt: TicketTypeWithAvailability,
): TicketTypeResponseDto {
  return {
    id: tt.id,
    name: tt.name,
    price: Number(tt.price),
    totalSeats: tt.totalSeats,
    availableSeats: tt.availableSeats,
    maxPerUser: tt.maxPerUser,
    isActive: tt.isActive,
    eventId: tt.eventId,
    createdAt: tt.createdAt,
    updatedAt: tt.updatedAt,
  };
}

async function accessibleEvent(
  eventId: string,
  requesterId: string,
  requesterRole: string,
) {
  const event = await eventRepository.findById(eventId);
  if (!event) throw new NotFoundError(`Event with id ${eventId}`);
  if (requesterRole === "ORGANIZER" && event.organizerId !== requesterId) {
    throw new ForbiddenError();
  }
  return event;
}

export async function findAllByEventId(
  eventId: string,
): Promise<TicketTypeResponseDto[]> {
  const event = await eventRepository.findById(eventId);
  if (!event) throw new NotFoundError(`Event with id ${eventId}`);

  const ticketTypes = await ticketTypeRepository.findAllByEventId(eventId);
  return ticketTypes.map(toTicketTypeResponse);
}

export async function create(
  eventId: string,
  requesterId: string,
  requesterRole: string,
  dto: CreateTicketTypeDto,
): Promise<TicketTypeResponseDto> {
  await accessibleEvent(eventId, requesterId, requesterRole);

  const existingTicketType = await ticketTypeRepository.findByName(dto.name);
  if (existingTicketType) {
    throw new ConflictError(`ticket type with name : ${dto.name}`);
  }

  const data: Prisma.TicketTypeUncheckedCreateInput = {
    name: dto.name,
    price: dto.price,
    totalSeats: dto.totalSeats,
    maxPerUser: dto.maxPerUser,
    eventId,
  };

  const created = await ticketTypeRepository.create(data);
  return toTicketTypeResponse(created);
}

export async function update(
  eventId: string,
  ticketTypeId: string,
  requesterId: string,
  requesterRole: string,
  dto: UpdateTicketTypeDto,
): Promise<TicketTypeResponseDto> {
  await accessibleEvent(eventId, requesterId, requesterRole);

  const ticketType = await ticketTypeRepository.findById(ticketTypeId);
  if (!ticketType)
    throw new NotFoundError(`TicketType with id ${ticketTypeId}`);
  if (ticketType.eventId !== eventId)
    throw new BadRequestError("TicketType does not belong to this event");

  if (dto.totalSeats !== undefined) {
    const bookedSeats = ticketType.totalSeats - ticketType.availableSeats;
    if (dto.totalSeats < bookedSeats) {
      throw new BadRequestError(
        `Cannot reduce total seats below already booked seats (${bookedSeats})`,
      );
    }
  }

  const data: Prisma.TicketTypeUpdateInput = {
    name: dto.name,
    price: dto.price,
    totalSeats: dto.totalSeats,
    maxPerUser: dto.maxPerUser,
  };

  const updated = await ticketTypeRepository.update(ticketTypeId, data);
  return toTicketTypeResponse(updated);
}

export async function deactivate(
  eventId: string,
  ticketTypeId: string,
  requesterId: string,
  requesterRole: string,
): Promise<TicketTypeResponseDto> {
  await accessibleEvent(eventId, requesterId, requesterRole);

  const ticketType = await ticketTypeRepository.findById(ticketTypeId);
  if (!ticketType)
    throw new NotFoundError(`TicketType with id ${ticketTypeId}`);
  if (ticketType.eventId !== eventId)
    throw new BadRequestError("TicketType does not belong to this event");

  if (!ticketType.isActive)
    throw new BadRequestError("TicketType is already inactive");

  const updated = await ticketTypeRepository.update(ticketTypeId, {
    isActive: false,
  });
  return toTicketTypeResponse(updated);
}
