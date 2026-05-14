import { NextFunction, Request, Response } from "express";
import * as userService from "./user.service.js";
import { CreateUserDto, UpdateUserDto } from "./user.dto.js";

export async function findAll(req: Request, res: Response, next: NextFunction) {
  try {
    const users = await userService.findAll();
    res.status(200).json(users);
  } catch (e) {
    next(e);
  }
}

export async function findById(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.params.id;
    const user = await userService.findById(userId);
    res.status(200).json(user);
  } catch (e) {
    next(e);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const userDto: CreateUserDto = req.body;
    const createdUser = await userService.create(userDto);
    res.status(201).json(createdUser);
  } catch (e) {
    next(e);
  }
}

export async function update(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.params.id;
    const userDto = req.body;
    const updatedUser = await userService.update(userId, userDto);
    res.status(200).json(updatedUser);
  } catch (e) {
    next(e);
  }
}

export async function deleteById(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.params.id;
    const deletedUser = await userService.deleteById(userId);
    res.status(200).json(deletedUser);
  } catch (e) {
    next(e);
  }
}
