import express from "express";
import cors from "cors";
import userRoutes from "./modules/user/user.route.js";
import errorHandler from "./middlewares/errorHandler.js";
import authRoutes from "./modules/auth/auth.route.js";
import eventRoutes from "./modules/event/event.route.js";
import eventCategoriesRoutes from "./modules/event/category.route.js";
import bookingRoutes from "./modules/booking/booking.route.js";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

const app = express();

app.use(express.json());
app.use(cors());

app.use(helmet());

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 100 });
app.use(limiter);

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10 });
app.use("/auth", authLimiter, authRoutes);

app.use("/users", userRoutes);

app.use("/events", eventRoutes);

app.use("/event-categories", eventCategoriesRoutes);

app.use("/bookings", bookingRoutes);

app.use(errorHandler);

export default app;
