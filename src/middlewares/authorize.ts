import { Request, Response, NextFunction } from "express";
import { ForbiddenError } from "../common/errors/index.js";

export default function authorize(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ForbiddenError(`Forbidden for : ${req.user?.role}`));
    }
    next();
  };
}
