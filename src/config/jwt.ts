import jwt from "jsonwebtoken";
import type { StringValue } from "ms";
import { UserRole } from "../generated/prisma/enums.js";

export type JwtPayload = {
  userId: string;
  role: "USER" | "ORGANIZER" | "ADMIN" | UserRole;
};

export function generateAccessToken(payload: JwtPayload): string {
  const expiresIn = (process.env.JWT_ACCESS_EXPIRES ?? "15m") as StringValue;
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn });
}

export function generateRefreshToken(payload: JwtPayload): string {
  const expiresIn = (process.env.JWT_REFRESH_EXPIRES ?? "7d") as StringValue;
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, { expiresIn });
}

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
}

export function verifyRefreshToken(token: string): JwtPayload {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as JwtPayload;
}
