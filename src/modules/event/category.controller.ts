import { NextFunction, Request, Response } from "express";
import * as categoryService from "./category.service.js";

export async function findAll(req: Request, res: Response, next: NextFunction) {
  try {
    const page = req.query.page as any;
    const limit = req.query.limit as any;

    const eventCategories = await categoryService.findAll(page, limit);
    res.status(200).json(eventCategories);
  } catch (e) {
    next(e);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const eventCategoryToCreate = req.body;
    const createdEventCategory = await categoryService.create(
      eventCategoryToCreate,
    );
    res.status(201).json(createdEventCategory);
  } catch (e) {
    next(e);
  }
}
