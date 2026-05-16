import { Router } from "express";
import * as eventController from "./event.controller.js";
import {
  validateBody,
  validateQueryParams,
} from "../../middlewares/validate.js";
import { CreateEventSchema, QueryParamsSchema } from "./event.dto.js";
import authenticate from "../../middlewares/authenticate.js";
import authorize from "../../middlewares/authorize.js";

const eventRoutes = Router();

eventRoutes.get(
  "/",
  validateQueryParams(QueryParamsSchema),
  eventController.findAll,
);

eventRoutes.post(
  "/",
  authenticate,
  authorize("ADMIN", "ORGANIZER"),
  validateBody(CreateEventSchema),
  eventController.create,
);

export default eventRoutes;
