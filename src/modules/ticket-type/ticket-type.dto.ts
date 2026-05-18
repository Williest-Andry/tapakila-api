import { z } from "zod";

export const CreateTicketTypeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.number().positive("Price must be positive"),
  totalSeats: z.number().int().positive("Total seats must be positive"),
  maxPerUser: z
    .number()
    .int()
    .positive("Max per user must be positive")
    .default(5),
});

export const UpdateTicketTypeSchema = z.object({
  name: z.string().min(1).optional(),
  price: z.number().positive().optional(),
  totalSeats: z.number().int().positive().optional(),
  maxPerUser: z.number().int().positive().optional(),
});

export type CreateTicketTypeDto = z.infer<typeof CreateTicketTypeSchema>;
export type UpdateTicketTypeDto = z.infer<typeof UpdateTicketTypeSchema>;

export interface TicketTypeResponseDto {
  id: string;
  name: string;
  price: number;
  totalSeats: number;
  availableSeats: number;
  maxPerUser: number;
  isActive: boolean;
  eventId: string;
  createdAt: Date;
  updatedAt: Date;
}
