import { Router } from "express";
import * as eventController from "./event.controller.js";
import { validateQueryParams } from "../../middlewares/validate.js";
import { QueryParamsSchema } from "./event.dto.js";

const eventRoutes = Router();

eventRoutes.get(
  "/",
  validateQueryParams(QueryParamsSchema),
  eventController.findAll,
);

export default eventRoutes;
