import { Router } from "express";
import * as userController from "./user.controller.js";

const userRoutes = Router();

userRoutes.get("/", userController.findAll);
userRoutes.post("/", userController.create);
userRoutes.put("/:id", userController.update);

export default userRoutes;
