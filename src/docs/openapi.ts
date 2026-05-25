import { OpenAPIRegistry, OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { LoginSchema, RefreshTokensSchema, RegisterSchema } from "../modules/auth/auth.dto.js";
import {
  CreateUserSchema,
  UpdateUserByAdminSchema,
  UpdateUserSchema,
  UserFiltersSchema,
} from "../modules/user/user.dto.js";
import {
  CreateEventSchema,
  EventFiltersSchema,
  UpdateEventStatusSchema,
} from "../modules/event/event.dto.js";
import {
  BookingFiltersSchema,
  CreateBookingSchema,
  UpdateBookingItemSchema,
} from "../modules/booking/booking.dto.js";
import {
  CreateTicketTypeSchema,
  UpdateTicketTypeSchema,
} from "../modules/ticket-type/ticket-type.dto.js";
import { CreateEventCategorySchema } from "../modules/event/category.dto.js";

const registry = new OpenAPIRegistry();

registry.registerComponent("securitySchemes", "bearerAuth", {
  type: "http",
  scheme: "bearer",
  bearerFormat: "JWT",
});

const idParam = z.object({ id: z.string().uuid() });
const eventIdParam = z.object({ eventId: z.string().uuid() });
const eventIdAndIdParams = z.object({ eventId: z.string().uuid(), id: z.string().uuid() });

const tokenResponseSchema = z.object({ accessToken: z.string(), refreshToken: z.string() });
const messageSchema = z.object({ message: z.string() });
const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  createdAt: z.string().datetime().or(z.date()),
  role: z.enum(["USER", "ORGANIZER", "ADMIN"]),
}).passthrough();
const categorySchema = z.object({ id: z.string().uuid(), name: z.string(), slug: z.string() }).passthrough();
const ticketTypeSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  price: z.number(),
  totalSeats: z.number().int(),
  availableSeats: z.number().int(),
  maxPerUser: z.number().int(),
  isActive: z.boolean(),
  eventId: z.string().uuid(),
  createdAt: z.string().datetime().or(z.date()),
  updatedAt: z.string().datetime().or(z.date()),
}).passthrough();
const eventSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string().nullable(),
  location: z.string(),
  eventDate: z.string().datetime().or(z.date()),
  imageUrl: z.string().nullable(),
  status: z.enum(["DRAFT", "PUBLISHED", "CANCELLED"]),
  createdAt: z.string().datetime().or(z.date()),
  updatedAt: z.string().datetime().or(z.date()),
  category: categorySchema,
  organizer: userSchema.pick({ id: true, email: true, firstName: true, lastName: true }),
  ticketTypes: z.array(ticketTypeSchema),
}).passthrough();

const bookingItemSchema = z.object({
  id: z.string().uuid(),
  quantity: z.number().int(),
  unitPrice: z.number(),
  ticketTypeId: z.string().uuid(),
  ticketTypeName: z.string(),
}).passthrough();
const bookingSchema = z.object({
  id: z.string().uuid(),
  status: z.string(),
  createdAt: z.string().datetime().or(z.date()),
  updatedAt: z.string().datetime().or(z.date()),
  eventId: z.string().uuid(),
  eventTitle: z.string(),
  eventDate: z.string().datetime().or(z.date()),
  userId: z.string().uuid(),
  items: z.array(bookingItemSchema),
  totalPrice: z.number(),
}).passthrough();

const paginatedSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({ data: z.array(itemSchema), meta: z.object({ page: z.number(), limit: z.number(), total: z.number() }).partial() }).passthrough();

const errorBodySchema = z.object({ message: z.string(), errors: z.unknown().optional() }).passthrough();
const errorResponses = {
  400: { description: "Validation error", content: { "application/json": { schema: errorBodySchema } } },
  401: { description: "Authentication required", content: { "application/json": { schema: errorBodySchema } } },
  403: { description: "Forbidden", content: { "application/json": { schema: errorBodySchema } } },
  404: { description: "Resource not found", content: { "application/json": { schema: errorBodySchema } } },
  409: { description: "Conflict", content: { "application/json": { schema: errorBodySchema } } },
  500: { description: "Internal server error", content: { "application/json": { schema: errorBodySchema } } },
};
const jsonResponse = (schema: z.ZodTypeAny, description: string) => ({ description, content: { "application/json": { schema } } });

registry.registerPath({ method: "post", path: "/auth/login", tags: ["Auth"], request: { body: { content: { "application/json": { schema: LoginSchema } } } }, responses: { 200: jsonResponse(tokenResponseSchema, "Login successful"), ...errorResponses } });
registry.registerPath({ method: "post", path: "/auth/logout", tags: ["Auth"], security: [{ bearerAuth: [] }], request: { body: { content: { "application/json": { schema: RefreshTokensSchema } } } }, responses: { 200: jsonResponse(messageSchema, "Logout successful"), ...errorResponses } });
registry.registerPath({ method: "post", path: "/auth/register", tags: ["Auth"], request: { body: { content: { "application/json": { schema: RegisterSchema } } } }, responses: { 201: jsonResponse(z.object({ data: userSchema.pick({ email: true, firstName: true, lastName: true }), tokens: tokenResponseSchema }), "Registration successful"), ...errorResponses } });
registry.registerPath({ method: "get", path: "/auth/me", tags: ["Auth"], security: [{ bearerAuth: [] }], responses: { 200: jsonResponse(userSchema, "Current user profile"), ...errorResponses } });
registry.registerPath({ method: "post", path: "/auth/refresh-tokens", tags: ["Auth"], request: { body: { content: { "application/json": { schema: RefreshTokensSchema } } } }, responses: { 200: jsonResponse(tokenResponseSchema, "Token refreshed"), ...errorResponses } });

registry.registerPath({ method: "get", path: "/users", tags: ["Users"], description: "Requires ADMIN role.", security: [{ bearerAuth: [] }], request: { query: UserFiltersSchema }, responses: { 200: jsonResponse(paginatedSchema(userSchema), "Users retrieved"), ...errorResponses } });
registry.registerPath({ method: "patch", path: "/users/me", tags: ["Users"], security: [{ bearerAuth: [] }], request: { body: { content: { "application/json": { schema: UpdateUserSchema } } } }, responses: { 200: jsonResponse(userSchema, "User profile updated"), ...errorResponses } });
registry.registerPath({ method: "patch", path: "/users/me/to-organizer", tags: ["Users"], description: "Requires USER role.", security: [{ bearerAuth: [] }], responses: { 200: jsonResponse(z.object({ organizer: userSchema, message: z.string() }), "Role changed to ORGANIZER"), ...errorResponses } });
registry.registerPath({ method: "get", path: "/users/{id}", tags: ["Users"], description: "Requires ADMIN role.", security: [{ bearerAuth: [] }], request: { params: idParam }, responses: { 200: jsonResponse(userSchema, "User found"), ...errorResponses } });
registry.registerPath({ method: "post", path: "/users", tags: ["Users"], description: "Requires ADMIN role.", security: [{ bearerAuth: [] }], request: { body: { content: { "application/json": { schema: CreateUserSchema } } } }, responses: { 201: jsonResponse(userSchema, "User created"), ...errorResponses } });
registry.registerPath({ method: "patch", path: "/users/{id}/deactivate", tags: ["Users"], description: "Requires ADMIN role.", security: [{ bearerAuth: [] }], request: { params: idParam }, responses: { 200: jsonResponse(userSchema, "User deactivated"), ...errorResponses } });
registry.registerPath({ method: "patch", path: "/users/{id}", tags: ["Users"], description: "Requires ADMIN role.", security: [{ bearerAuth: [] }], request: { params: idParam, body: { content: { "application/json": { schema: UpdateUserByAdminSchema } } } }, responses: { 200: jsonResponse(userSchema, "User updated"), ...errorResponses } });

registry.registerPath({ method: "get", path: "/events", tags: ["Events"], request: { query: EventFiltersSchema }, responses: { 200: jsonResponse(paginatedSchema(eventSchema), "Events retrieved"), ...errorResponses } });
registry.registerPath({ method: "post", path: "/events", tags: ["Events"], description: "Requires ADMIN or ORGANIZER role.", security: [{ bearerAuth: [] }], request: { body: { content: { "application/json": { schema: CreateEventSchema } } } }, responses: { 201: jsonResponse(eventSchema, "Event created"), ...errorResponses } });
registry.registerPath({ method: "patch", path: "/events/{id}/status", tags: ["Events"], description: "Requires ADMIN or ORGANIZER role.", security: [{ bearerAuth: [] }], request: { params: idParam, body: { content: { "application/json": { schema: UpdateEventStatusSchema } } } }, responses: { 200: jsonResponse(eventSchema, "Event status updated"), ...errorResponses } });

registry.registerPath({ method: "get", path: "/events/{eventId}/ticket-types", tags: ["TicketTypes"], request: { params: eventIdParam }, responses: { 200: jsonResponse(z.array(ticketTypeSchema), "Ticket types retrieved"), ...errorResponses } });
registry.registerPath({ method: "post", path: "/events/{eventId}/ticket-types", tags: ["TicketTypes"], description: "Requires ADMIN or ORGANIZER role.", security: [{ bearerAuth: [] }], request: { params: eventIdParam, body: { content: { "application/json": { schema: CreateTicketTypeSchema } } } }, responses: { 201: jsonResponse(ticketTypeSchema, "Ticket type created"), ...errorResponses } });
registry.registerPath({ method: "patch", path: "/events/{eventId}/ticket-types/{id}", tags: ["TicketTypes"], description: "Requires ADMIN or ORGANIZER role.", security: [{ bearerAuth: [] }], request: { params: eventIdAndIdParams, body: { content: { "application/json": { schema: UpdateTicketTypeSchema } } } }, responses: { 200: jsonResponse(ticketTypeSchema, "Ticket type updated"), ...errorResponses } });
registry.registerPath({ method: "patch", path: "/events/{eventId}/ticket-types/{id}/deactivate", tags: ["TicketTypes"], description: "Requires ADMIN or ORGANIZER role.", security: [{ bearerAuth: [] }], request: { params: eventIdAndIdParams }, responses: { 200: jsonResponse(ticketTypeSchema, "Ticket type deactivated"), ...errorResponses } });

registry.registerPath({ method: "get", path: "/event-categories", tags: ["Categories"], responses: { 200: jsonResponse(paginatedSchema(categorySchema), "Categories retrieved"), ...errorResponses } });
registry.registerPath({ method: "get", path: "/event-categories/{id}", tags: ["Categories"], request: { params: idParam }, responses: { 200: jsonResponse(categorySchema, "Category found"), ...errorResponses } });
registry.registerPath({ method: "post", path: "/event-categories", tags: ["Categories"], description: "Requires ADMIN role.", security: [{ bearerAuth: [] }], request: { body: { content: { "application/json": { schema: CreateEventCategorySchema } } } }, responses: { 201: jsonResponse(categorySchema, "Category created"), ...errorResponses } });

registry.registerPath({ method: "get", path: "/bookings", tags: ["Bookings"], security: [{ bearerAuth: [] }], request: { query: BookingFiltersSchema }, responses: { 200: jsonResponse(paginatedSchema(bookingSchema), "Bookings retrieved"), ...errorResponses } });
registry.registerPath({ method: "get", path: "/bookings/{id}", tags: ["Bookings"], security: [{ bearerAuth: [] }], request: { params: idParam }, responses: { 200: jsonResponse(bookingSchema, "Booking found"), ...errorResponses } });
registry.registerPath({ method: "post", path: "/bookings", tags: ["Bookings"], description: "Requires USER or ORGANIZER role.", security: [{ bearerAuth: [] }], request: { body: { content: { "application/json": { schema: CreateBookingSchema } } } }, responses: { 201: jsonResponse(bookingSchema, "Booking created"), ...errorResponses } });
registry.registerPath({ method: "patch", path: "/bookings/{id}/cancel", tags: ["Bookings"], security: [{ bearerAuth: [] }], request: { params: idParam }, responses: { 200: jsonResponse(bookingSchema, "Booking cancelled"), ...errorResponses } });
registry.registerPath({ method: "patch", path: "/bookings/{id}", tags: ["Bookings"], description: "Requires USER or ORGANIZER role.", security: [{ bearerAuth: [] }], request: { params: idParam, body: { content: { "application/json": { schema: UpdateBookingItemSchema } } } }, responses: { 200: jsonResponse(bookingSchema, "Booking item updated"), ...errorResponses } });

export function generateOpenApiDoc(): Record<string, unknown> {
  const generator = new OpenApiGeneratorV3(registry.definitions);
  return generator.generateDocument({
    openapi: "3.0.0",
    info: {
      title: "Tapakila API",
      version: "1.0.0",
      description: "REST API for Tapakila — an event ticketing platform",
    },
    servers: [
      { url: "http://localhost:3000", description: "Development" },
      { url: process.env.API_URL ?? "", description: "Production" },
    ],
  }) as Record<string, unknown>;
}
