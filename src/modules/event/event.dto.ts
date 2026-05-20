import z from "zod";
import { EventStatus } from "../../../generated/prisma/enums.js";
import { Decimal } from "../../../generated/prisma/internal/prismaNamespace.js";

export const CreateEventSchema = z.object({
  title: z.string().min(1).max(50),
  description: z.string().min(1).optional(),
  location: z.string().min(1),
  eventDate: z.coerce.date("Correct datetime format is : YYYY-MM-DDTHH:mm:ssZ"),
  imageUrl: z.string().optional(),
  category: z.object({
    id: z.uuid(),
  }),
});

export const UpdateEventStatusSchema = z.object({
  status: z.enum(["DRAFT", "PUBLISHED", "CANCELLED"]),
});

export const EventFiltersSchema = z.object({
  search: z.string().optional(),
  categoryId: z.uuid().optional(),
  location: z.string().optional(),
  organizerId: z.uuid().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "CANCELLED"]).optional(),
  dateFrom: z.coerce.date().optional(),
  dateTo: z.coerce.date().optional(),
  priceMin: z.coerce.number().nonnegative().optional(),
  priceMax: z.coerce.number().positive().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z.enum(["eventDate", "createdAt", "title"]).default("eventDate"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

export type CreateEventDto = z.infer<typeof CreateEventSchema>;
export type UpdateEventStatusDto = z.infer<typeof UpdateEventStatusSchema>;
export type EventFiltersDto = z.infer<typeof EventFiltersSchema>;

export type EventResponseDto = {
  id: string;
  title: string;
  description: string | null;
  location: string;
  eventDate: Date;
  imageUrl: string | null;
  status: EventStatus;
  createdAt: Date;
  updatedAt: Date;
  category: {
    id: string;
    name: string;
  };
  organizer: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  ticketTypes: {
    id: string;
    name: string;
    price: Decimal;
    totalSeats: number;
    maxPerUser: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }[];
};
