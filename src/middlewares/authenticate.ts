import { Request, Response, NextFunction } from "express";
import { verifyAccessToken, JwtPayload } from "../config/jwt.js";
import { UnauthorizedError } from "../common/errors/index.js";
import * as userRepository from "../modules/user/user.repository.js";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export default async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new UnauthorizedError("Invalid token"));
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyAccessToken(token);

    const user = await userRepository.findById(decoded.userId);
    if (!user || !user.isActive) {
      return next(new UnauthorizedError("Account deactivated"));
    }

    req.user = decoded;
    next();
  } catch {
    next(new UnauthorizedError("Invalid or expired token"));
  }
}
