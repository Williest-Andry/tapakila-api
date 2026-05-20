import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../config/jwt.js";

export function authenticateOptional(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next();
  }

  try {
    const token = authHeader.split(" ")[1];
    req.user = verifyAccessToken(token);
    next();
  } catch {
    next();
  }
}
