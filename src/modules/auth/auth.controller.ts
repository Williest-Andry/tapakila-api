import { NextFunction, Request, Response } from "express";
import * as authService from "./auth.service.js";

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const loginDto = req.body;
    const tokens = await authService.login(loginDto);
    res.status(200).json(tokens);
  } catch (e) {
    next(e);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    const refreshToken = req.body.refreshToken;
    const userId = req.user?.userId ?? "";
    const message = await authService.logout(userId, refreshToken);
    res.status(200).json(message);
  } catch (e) {
    next(e);
  }
}
