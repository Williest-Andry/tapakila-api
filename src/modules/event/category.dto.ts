import z from "zod";

export const CreateEventCategorySchema = z.object({
  name: z.string().min(1).max(20),
});

export type CreateEventCategoryDto = z.infer<typeof CreateEventCategorySchema>;

export type EventCategoryResponseDto = {
  id: string;
  name: string;
  slug: string;
};
