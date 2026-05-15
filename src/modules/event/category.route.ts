import { Router } from "express";
import * as categoryController from "./category.controller.js";

const eventCategoriesRoutes = Router();

eventCategoriesRoutes.get("/", categoryController.findAll);

export default eventCategoriesRoutes;
