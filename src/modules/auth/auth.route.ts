import { Router } from "express";
import * as authController from "./auth.controller.js";
import { validateBody } from "../../middlewares/validate.js";
import { LoginSchema, LogoutSchema, RegisterSchema } from "./auth.dto.js";
import authenticate from "../../middlewares/authentificate.js";

const authRoutes = Router();

authRoutes.post("/login", validateBody(LoginSchema), authController.login);

authRoutes.post(
  "/logout",
  authenticate,
  validateBody(LogoutSchema),
  authController.logout,
);

authRoutes.post(
  "/register",
  validateBody(RegisterSchema),
  authController.register,
);

authRoutes.get("/me", authenticate, authController.getProfile);

export default authRoutes;
