import { NextFunction, Request, Response } from "express";
import * as eventService from "./event.service.js";

export async function findAll(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.query.userId as string;
    const userRole = req.query.userRole as any;
    const page = req.query.page as any;
    const limit = req.query.page as any;

    const events = await eventService.findAll(userId, userRole, page, limit);
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
