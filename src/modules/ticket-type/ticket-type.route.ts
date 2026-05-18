import { Router } from "express";
import * as ticketTypeController from "./ticket-type.controller.js";
import { validateBody } from "../../middlewares/validate.js";
import {
  CreateTicketTypeSchema,
  UpdateTicketTypeSchema,
} from "./ticket-type.dto.js";
import authenticate from "../../middlewares/authenticate.js";
import authorize from "../../middlewares/authorize.js";

const ticketTypeRoutes = Router({ mergeParams: true });

ticketTypeRoutes.get("/", ticketTypeController.findAll);

ticketTypeRoutes.post(
  "/",
  authenticate,
  authorize("ADMIN", "ORGANIZER"),
  validateBody(CreateTicketTypeSchema),
  ticketTypeController.create,
);

ticketTypeRoutes.patch(
  "/:id",
  authenticate,
  authorize("ADMIN", "ORGANIZER"),
  validateBody(UpdateTicketTypeSchema),
  ticketTypeController.update,
);

ticketTypeRoutes.patch(
  "/:id/deactivate",
  authenticate,
  authorize("ADMIN", "ORGANIZER"),
  ticketTypeController.deactivate,
);

export default ticketTypeRoutes;
