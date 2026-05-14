import { Router } from "express";
import * as userController from "./user.controller.js";
import { validateBody } from "../../middlewares/validate.js";
import {
  CreateUserSchema,
  UpdateUserByAdminSchema,
  UpdateUserSchema,
} from "./user.dto.js";
import authenticate from "../../middlewares/authenticate.js";
import authorize from "../../middlewares/authorize.js";

const userRoutes = Router();

userRoutes.get("/", authenticate, authorize("ADMIN"), userController.findAll);

userRoutes.patch(
  "/me",
  authenticate,
  validateBody(UpdateUserSchema),
  userController.updateUserProfile,
);

userRoutes.patch(
  "/me/to-organizer",
  authenticate,
  authorize("USER"),
  userController.toOrganizer,
);

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
  validateBody(UpdateUserByAdminSchema),
  userController.update,
);

userRoutes.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  userController.deleteById,
);

export default userRoutes;
