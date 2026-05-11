import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import AppError from "../utils/AppError.js";

export default function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (err instanceof ZodError) {
    res.status(400).json({
      message: "Invalid data",
      errors: err.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
    return;
  }

  if (err instanceof AppError) {
    res
      .status(err.status || 500)
      .json({ message: err.message || "Internal error" });
    return;
  }
}
