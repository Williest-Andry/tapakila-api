import { z } from "zod";

export const CreateBookingSchema = z.object({
  eventId: z.uuid("Invalid event id"),
  items: z
    .array(
      z.object({
        ticketTypeId: z.uuid("Invalid ticket type id"),
        quantity: z.number().int().positive("Quantity must be positive"),
      }),
    )
    .min(1, "At least one item is required"),
});

export const BookingFiltersSchema = z.object({
  eventId: z.uuid().optional(),
  status: z.enum(["CONFIRMED", "CANCELLED"]).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const UpdateBookingItemSchema = z.object({
  ticketTypeId: z.string().uuid("Invalid ticket type id"),
  quantity: z.number().int().positive("Quantity must be positive"),
});

export type CreateBookingDto = z.infer<typeof CreateBookingSchema>;
export type BookingFiltersDto = z.infer<typeof BookingFiltersSchema>;
export type UpdateBookingItemDto = z.infer<typeof UpdateBookingItemSchema>;

export interface BookingItemResponseDto {
  id: string;
  quantity: number;
  unitPrice: number;
  ticketTypeId: string;
  ticketTypeName: string;
}

export interface BookingResponseDto {
  id: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  eventId: string;
  eventTitle: string;
  eventDate: Date;
  userId: string;
  items: BookingItemResponseDto[];
  totalPrice: number;
}
