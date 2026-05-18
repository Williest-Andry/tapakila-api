import { Request, Response, NextFunction } from "express";
import * as bookingService from "./booking.service.js";
import { ReservationFiltersSchema } from "./booking.dto.js";

export async function findAll(req: Request, res: Response, next: NextFunction) {
  try {
    const bookings = await bookingService.findAll(
      req.user!.userId,
      req.user!.role,
      req.query as any,
    );
    res.status(200).json(bookings);
  } catch (e) {
    next(e);
  }
}

export async function findById(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) {
  try {
    const booking = await bookingService.findById(
      req.params.id,
      req.user!.userId,
      req.user!.role,
    );
    res.status(200).json(booking);
  } catch (e) {
    next(e);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const booking = await bookingService.create(req.user!.userId, req.body);
    res.status(201).json(booking);
  } catch (e) {
    next(e);
  }
}

export async function cancel(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) {
  try {
    const booking = await bookingService.cancel(
      req.params.id,
      req.user!.userId,
      req.user!.role,
    );
    res.status(200).json(booking);
  } catch (e) {
    next(e);
  }
}
