import { Router } from "express";
import * as userController from "./user.controller.js";
import { validateBody } from "../../middlewares/validate.js";
import { CreateUserSchema, UpdateUserSchema } from "./user.dto.js";

const userRoutes = Router();

userRoutes.get("/", userController.findAll);
userRoutes.get("/:id", userController.findById);
userRoutes.post("/", validateBody(CreateUserSchema), userController.create);
userRoutes.patch("/:id", validateBody(UpdateUserSchema), userController.update);
userRoutes.delete("/:id", userController.deleteById);

export default userRoutes;
