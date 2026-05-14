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
    const { refreshToken } = req.body;
    const message = await authService.logout(refreshToken);
    res.status(200).json(message);
  } catch (e) {
    next(e);
  }
}

export async function register(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userToCreate = req.body;
    const createdUser = await authService.register(userToCreate);
    res.status(201).json(createdUser);
  } catch (e) {
    next(e);
  }
}

export async function getProfile(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user!.userId;
    const userProfile = await authService.getProfile(userId);
    res.status(200).json(userProfile);
  } catch (e) {
    next(e);
  }
}

export async function refreshToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const refreshToken = req.body.refreshToken;
    const tokens = await authService.refreshToken(refreshToken);
    res.status(200).json(tokens);
  } catch (e) {
    next(e);
  }
}
