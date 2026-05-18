import { Request, Response, NextFunction } from "express";
import * as ticketTypeService from "./ticket-type.service.js";

export async function findAll(
  req: Request<{ eventId: string }>,
  res: Response,
  next: NextFunction,
) {
  try {
    const ticketTypes = await ticketTypeService.findAllByEventId(
      req.params.eventId,
    );
    res.status(200).json(ticketTypes);
  } catch (e) {
    next(e);
  }
}

export async function create(
  req: Request<{ eventId: string }>,
  res: Response,
  next: NextFunction,
) {
  try {
    const ticketType = await ticketTypeService.create(
      req.params.eventId,
      req.user!.userId,
      req.user!.role,
      req.body,
    );
    res.status(201).json(ticketType);
  } catch (e) {
    next(e);
  }
}

export async function update(
  req: Request<{ eventId: string; id: string }>,
  res: Response,
  next: NextFunction,
) {
  try {
    const ticketType = await ticketTypeService.update(
      req.params.eventId,
      req.params.id,
      req.user!.userId,
      req.user!.role,
      req.body,
    );
    res.status(200).json(ticketType);
  } catch (e) {
    next(e);
  }
}

export async function deactivate(
  req: Request<{ eventId: string; id: string }>,
  res: Response,
  next: NextFunction,
) {
  try {
    const ticketType = await ticketTypeService.deactivate(
      req.params.eventId,
      req.params.id,
      req.user!.userId,
      req.user!.role,
    );
    res.status(200).json(ticketType);
  } catch (e) {
    next(e);
  }
}
