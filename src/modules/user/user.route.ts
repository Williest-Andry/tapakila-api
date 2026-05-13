import { Router } from "express";
import * as userController from "./user.controller.js";
import { validateBody } from "../../middlewares/validate.js";
import { CreateUserSchema, UpdateUserSchema } from "./user.dto.js";
import authenticate from "../../middlewares/authentificate.js";
import authorize from "../../middlewares/authorize.js";

const userRoutes = Router();

userRoutes.get("/", authenticate, authorize("ADMIN"), userController.findAll);

userRoutes.get(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  userController.findById,
);

userRoutes.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  validateBody(CreateUserSchema),
  userController.create,
);

userRoutes.patch(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  validateBody(UpdateUserSchema),
  userController.update,
);

userRoutes.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  userController.deleteById,
);

export default userRoutes;
