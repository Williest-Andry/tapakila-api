import express from "express";
import cors from "cors";
import userRoutes from "./modules/user/user.route.js";
import errorHandler from "./middlewares/errorHandler.js";
import authRoutes from "./modules/auth/auth.route.js";
import eventRoutes from "./modules/event/event.route.js";
import eventCategoriesRoutes from "./modules/event/category.route.js";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/auth", authRoutes);

app.use("/users", userRoutes);

app.use("/events", eventRoutes);

app.use("/event-categories", eventCategoriesRoutes);

app.use(errorHandler);

export default app;
