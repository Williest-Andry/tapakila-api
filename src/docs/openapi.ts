import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
} from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import {
  LoginSchema,
  RefreshTokensSchema,
  RegisterSchema,
} from "../modules/auth/auth.dto.js";
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
const eventIdAndIdParams = z.object({
  eventId: z.string().uuid(),
  id: z.string().uuid(),
});

const commonErrorResponses = {
  400: { description: "Validation error" },
  401: { description: "Authentication required" },
  403: { description: "Forbidden" },
  404: { description: "Resource not found" },
  409: { description: "Conflict" },
  500: { description: "Internal server error" },
};

// Auth
registry.registerPath({
  method: "post",
  path: "/auth/login",
  tags: ["Auth"],
  request: {
    body: { content: { "application/json": { schema: LoginSchema } } },
  },
  responses: {
    200: { description: "Login successful" },
    ...commonErrorResponses,
  },
});
registry.registerPath({
  method: "post",
  path: "/auth/logout",
  tags: ["Auth"],
  security: [{ bearerAuth: [] }],
  request: {
    body: { content: { "application/json": { schema: RefreshTokensSchema } } },
  },
  responses: {
    200: { description: "Logout successful" },
    ...commonErrorResponses,
  },
});
registry.registerPath({
  method: "post",
  path: "/auth/register",
  tags: ["Auth"],
  request: {
    body: { content: { "application/json": { schema: RegisterSchema } } },
  },
  responses: {
    201: { description: "Registration successful" },
    ...commonErrorResponses,
  },
});
registry.registerPath({
  method: "get",
  path: "/auth/me",
  tags: ["Auth"],
  security: [{ bearerAuth: [] }],
  responses: {
    200: { description: "Current user profile" },
    ...commonErrorResponses,
  },
});
registry.registerPath({
  method: "post",
  path: "/auth/refresh-tokens",
  tags: ["Auth"],
  request: {
    body: { content: { "application/json": { schema: RefreshTokensSchema } } },
  },
  responses: {
    200: { description: "Token refreshed" },
    ...commonErrorResponses,
  },
});

// Users
registry.registerPath({
  method: "get",
  path: "/users",
  tags: ["Users"],
  description: "Requires ADMIN role.",
  security: [{ bearerAuth: [] }],
  request: { query: UserFiltersSchema },
  responses: {
    200: { description: "Users retrieved" },
    ...commonErrorResponses,
  },
});
registry.registerPath({
  method: "patch",
  path: "/users/me",
  tags: ["Users"],
  security: [{ bearerAuth: [] }],
  request: {
    body: { content: { "application/json": { schema: UpdateUserSchema } } },
  },
  responses: {
    200: { description: "User profile updated" },
    ...commonErrorResponses,
  },
});
registry.registerPath({
  method: "patch",
  path: "/users/me/to-organizer",
  tags: ["Users"],
  description: "Requires USER role.",
  security: [{ bearerAuth: [] }],
  responses: {
    200: { description: "Role changed to ORGANIZER" },
    ...commonErrorResponses,
  },
});
registry.registerPath({
  method: "get",
  path: "/users/{id}",
  tags: ["Users"],
  description: "Requires ADMIN role.",
  security: [{ bearerAuth: [] }],
  request: { params: idParam },
  responses: { 200: { description: "User found" }, ...commonErrorResponses },
});
registry.registerPath({
  method: "post",
  path: "/users",
  tags: ["Users"],
  description: "Requires ADMIN role.",
  security: [{ bearerAuth: [] }],
  request: {
    body: { content: { "application/json": { schema: CreateUserSchema } } },
  },
  responses: { 201: { description: "User created" }, ...commonErrorResponses },
});
registry.registerPath({
  method: "patch",
  path: "/users/{id}/deactivate",
  tags: ["Users"],
  description: "Requires ADMIN role.",
  security: [{ bearerAuth: [] }],
  request: { params: idParam },
  responses: {
    200: { description: "User deactivated" },
    ...commonErrorResponses,
  },
});
registry.registerPath({
  method: "patch",
  path: "/users/{id}",
  tags: ["Users"],
  description: "Requires ADMIN role.",
  security: [{ bearerAuth: [] }],
  request: {
    params: idParam,
    body: {
      content: { "application/json": { schema: UpdateUserByAdminSchema } },
    },
  },
  responses: { 200: { description: "User updated" }, ...commonErrorResponses },
});

// Events
registry.registerPath({
  method: "get",
  path: "/events",
  tags: ["Events"],
  request: { query: EventFiltersSchema },
  responses: {
    200: { description: "Events retrieved" },
    ...commonErrorResponses,
  },
});
registry.registerPath({
  method: "post",
  path: "/events",
  tags: ["Events"],
  description: "Requires ADMIN or ORGANIZER role.",
  security: [{ bearerAuth: [] }],
  request: {
    body: { content: { "application/json": { schema: CreateEventSchema } } },
  },
  responses: { 201: { description: "Event created" }, ...commonErrorResponses },
});
registry.registerPath({
  method: "patch",
  path: "/events/{id}/status",
  tags: ["Events"],
  description: "Requires ADMIN or ORGANIZER role.",
  security: [{ bearerAuth: [] }],
  request: {
    params: idParam,
    body: {
      content: { "application/json": { schema: UpdateEventStatusSchema } },
    },
  },
  responses: {
    200: { description: "Event status updated" },
    ...commonErrorResponses,
  },
});

// Ticket Types
registry.registerPath({
  method: "get",
  path: "/events/{eventId}/ticket-types",
  tags: ["TicketTypes"],
  request: { params: eventIdParam },
  responses: {
    200: { description: "Ticket types retrieved" },
    ...commonErrorResponses,
  },
});
registry.registerPath({
  method: "post",
  path: "/events/{eventId}/ticket-types",
  tags: ["TicketTypes"],
  description: "Requires ADMIN or ORGANIZER role.",
  security: [{ bearerAuth: [] }],
  request: {
    params: eventIdParam,
    body: {
      content: { "application/json": { schema: CreateTicketTypeSchema } },
    },
  },
  responses: {
    201: { description: "Ticket type created" },
    ...commonErrorResponses,
  },
});
registry.registerPath({
  method: "patch",
  path: "/events/{eventId}/ticket-types/{id}",
  tags: ["TicketTypes"],
  description: "Requires ADMIN or ORGANIZER role.",
  security: [{ bearerAuth: [] }],
  request: {
    params: eventIdAndIdParams,
    body: {
      content: { "application/json": { schema: UpdateTicketTypeSchema } },
    },
  },
  responses: {
    200: { description: "Ticket type updated" },
    ...commonErrorResponses,
  },
});
registry.registerPath({
  method: "patch",
  path: "/events/{eventId}/ticket-types/{id}/deactivate",
  tags: ["TicketTypes"],
  description: "Requires ADMIN or ORGANIZER role.",
  security: [{ bearerAuth: [] }],
  request: { params: eventIdAndIdParams },
  responses: {
    200: { description: "Ticket type deactivated" },
    ...commonErrorResponses,
  },
});

// Categories
registry.registerPath({
  method: "get",
  path: "/event-categories",
  tags: ["Categories"],
  responses: {
    200: { description: "Categories retrieved" },
    ...commonErrorResponses,
  },
});
registry.registerPath({
  method: "get",
  path: "/event-categories/{id}",
  tags: ["Categories"],
  request: { params: idParam },
  responses: {
    200: { description: "Category found" },
    ...commonErrorResponses,
  },
});
registry.registerPath({
  method: "post",
  path: "/event-categories",
  tags: ["Categories"],
  description: "Requires ADMIN role.",
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: { "application/json": { schema: CreateEventCategorySchema } },
    },
  },
  responses: {
    201: { description: "Category created" },
    ...commonErrorResponses,
  },
});

// Bookings
registry.registerPath({
  method: "get",
  path: "/bookings",
  tags: ["Bookings"],
  security: [{ bearerAuth: [] }],
  request: { query: BookingFiltersSchema },
  responses: {
    200: { description: "Bookings retrieved" },
    ...commonErrorResponses,
  },
});
registry.registerPath({
  method: "get",
  path: "/bookings/{id}",
  tags: ["Bookings"],
  security: [{ bearerAuth: [] }],
  request: { params: idParam },
  responses: { 200: { description: "Booking found" }, ...commonErrorResponses },
});
registry.registerPath({
  method: "post",
  path: "/bookings",
  tags: ["Bookings"],
  description: "Requires USER or ORGANIZER role.",
  security: [{ bearerAuth: [] }],
  request: {
    body: { content: { "application/json": { schema: CreateBookingSchema } } },
  },
  responses: {
    201: { description: "Booking created" },
    ...commonErrorResponses,
  },
});
registry.registerPath({
  method: "patch",
  path: "/bookings/{id}/cancel",
  tags: ["Bookings"],
  security: [{ bearerAuth: [] }],
  request: { params: idParam },
  responses: {
    200: { description: "Booking cancelled" },
    ...commonErrorResponses,
  },
});
registry.registerPath({
  method: "patch",
  path: "/bookings/{id}",
  tags: ["Bookings"],
  description: "Requires USER or ORGANIZER role.",
  security: [{ bearerAuth: [] }],
  request: {
    params: idParam,
    body: {
      content: { "application/json": { schema: UpdateBookingItemSchema } },
    },
  },
  responses: {
    200: { description: "Booking item updated" },
    ...commonErrorResponses,
  },
});

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
