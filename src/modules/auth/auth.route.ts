import { Router } from "express";
import * as authController from "./auth.controller.js";
import { validateBody } from "../../middlewares/validate.js";
import { LoginSchema } from "./auth.dto.js";

const authRoutes = Router();

authRoutes.post("/login", validateBody(LoginSchema), authController.login);

export default authRoutes;
