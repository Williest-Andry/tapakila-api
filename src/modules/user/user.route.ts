import { Router } from "express";
import * as userController from "./user.controller.js";

const userRoutes = Router();

userRoutes.get("/", userController.findAll);
userRoutes.post("/", userController.create);
userRoutes.put("/:id", userController.update);
userRoutes.delete("/:id", userController.deleteById)

export default userRoutes;
