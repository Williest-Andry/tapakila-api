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
