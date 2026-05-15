import { Router } from "express";
import * as categoryController from "./category.controller.js";
import authenticate from "../../middlewares/authenticate.js";
import authorize from "../../middlewares/authorize.js";
import { validateBody } from "../../middlewares/validate.js";
import { CreateEventCategorySchema } from "./category.dto.js";

const eventCategoriesRoutes = Router();

eventCategoriesRoutes.get("/", categoryController.findAll);

eventCategoriesRoutes.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  validateBody(CreateEventCategorySchema),
  categoryController.create,
);

export default eventCategoriesRoutes;
