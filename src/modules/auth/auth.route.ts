import { Router } from "express";
import * as authController from "./auth.controller.js";
import { validateBody } from "../../middlewares/validate.js";
import { LoginSchema, LogoutSchema } from "./auth.dto.js";
import authenticate from "../../middlewares/authentificate.js";

const authRoutes = Router();

authRoutes.post("/login", validateBody(LoginSchema), authController.login);
authRoutes.post(
  "/logout",
  authenticate,
  validateBody(LogoutSchema),
  authController.logout,
);

export default authRoutes;
