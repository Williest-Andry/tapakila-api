import { Router } from "express";
import * as authController from "./auth.controller.js";
import { validateBody } from "../../middlewares/validate.js";
import {
  LoginSchema,
  RefreshTokensSchema,
  RegisterSchema,
} from "./auth.dto.js";
import authenticate from "../../middlewares/authentificate.js";

const authRoutes = Router();

authRoutes.post("/login", validateBody(LoginSchema), authController.login);

authRoutes.post(
  "/logout",
  authenticate,
  validateBody(RefreshTokensSchema),
  authController.logout,
);

authRoutes.post(
  "/register",
  validateBody(RegisterSchema),
  authController.register,
);

authRoutes.get("/me", authenticate, authController.getProfile);

authRoutes.post(
  "/refresh-tokens",
  validateBody(RefreshTokensSchema),
  authController.refreshToken,
);

export default authRoutes;
