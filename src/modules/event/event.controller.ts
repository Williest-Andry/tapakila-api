import { NextFunction, Request, Response } from "express";
import * as eventService from "./event.service.js";

export async function findAll(req: Request, res: Response, next: NextFunction) {
  try {
    const filters = req.query as any;
    const userId = req.user?.userId ?? null;
    const userRole = req.user?.role ?? null;

    const events = await eventService.findAll(userId, userRole, filters);
    res.status(200).json(events);
  } catch (e) {
    next(e);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const organizerId = req.user?.userId as string;
    const eventTocreate = req.body;

    const createdEvent = await eventService.create(organizerId, eventTocreate);
    res.status(201).json(createdEvent);
  } catch (e) {
    next(e);
  }
}

export async function updateStatus(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const eventId = req.params.id as string;
    const eventStatusDto = req.body;
    const { userId, role } = req.user!;

    const updatedEvent = await eventService.updateStatus(
      eventId,
      eventStatusDto,
      userId,
      role,
    );
    res.status(200).json(updatedEvent);
  } catch (e) {
    next(e);
  }
}
