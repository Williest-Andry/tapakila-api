import z from "zod";
import { EventStatus } from "../../../generated/prisma/enums.js";
import { Decimal } from "../../../generated/prisma/internal/prismaNamespace.js";

export const QueryParamsSchema = z.object({
  userId: z.uuid("userId must be UUID").optional(),
  userRole: z
    .enum(
      ["USER", "ORGANIZER", "ADMIN"],
      "userRole must be USER or ORGANIZER or ADMIN",
    )
    .optional(),
  page: z.int("page must be positive").optional(),
  limit: z.int("limit must be positive").optional(),
});

export type QueryParamsDto = z.infer<typeof QueryParamsSchema>;

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
