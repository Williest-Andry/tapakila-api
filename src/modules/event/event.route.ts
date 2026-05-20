import { Router } from "express";
import * as eventController from "./event.controller.js";
import {
  validateBody,
  validateQueryParams,
} from "../../middlewares/validate.js";
import {
  CreateEventSchema,
  EventFiltersSchema,
  UpdateEventStatusSchema,
} from "./event.dto.js";
import authenticate from "../../middlewares/authenticate.js";
import authorize from "../../middlewares/authorize.js";
import ticketTypeRoutes from "../ticket-type/ticket-type.route.js";
import { authenticateOptional } from "../../middlewares/authenticateOptional.js";

const eventRoutes = Router();

eventRoutes.get(
  "/",
  authenticateOptional,
  validateQueryParams(EventFiltersSchema),
  eventController.findAll,
);

eventRoutes.post(
  "/",
  authenticate,
  authorize("ADMIN", "ORGANIZER"),
  validateBody(CreateEventSchema),
  eventController.create,
);

eventRoutes.patch(
  "/:id/status",
  authenticate,
  authorize("ADMIN", "ORGANIZER"),
  validateBody(UpdateEventStatusSchema),
  eventController.updateStatus,
);

eventRoutes.use("/:eventId/ticket-types", ticketTypeRoutes);

export default eventRoutes;
