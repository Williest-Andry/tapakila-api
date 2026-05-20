import { Router } from "express";
import * as bookingController from "./booking.controller.js";
import {
  validateBody,
  validateQueryParams,
} from "../../middlewares/validate.js";
import {
  BookingFiltersSchema,
  CreateBookingSchema,
  UpdateBookingItemSchema,
} from "./booking.dto.js";
import authenticate from "../../middlewares/authenticate.js";
import authorize from "../../middlewares/authorize.js";

const bookingRoutes = Router();

bookingRoutes.use(authenticate);

bookingRoutes.get(
  "/",
  validateQueryParams(BookingFiltersSchema),
  bookingController.findAll,
);

bookingRoutes.get("/:id", bookingController.findById);

bookingRoutes.post(
  "/",
  authorize("USER", "ORGANIZER"),
  validateBody(CreateBookingSchema),
  bookingController.create,
);

bookingRoutes.patch("/:id/cancel", bookingController.cancel);

bookingRoutes.patch(
  "/:id",
  authorize("USER", "ORGANIZER"),
  validateBody(UpdateBookingItemSchema),
  bookingController.updateItem,
);

export default bookingRoutes;
