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
import swaggerUi from "swagger-ui-express";
import { generateOpenApiDoc } from "./docs/openapi.js";

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

const openApiDoc = generateOpenApiDoc();
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiDoc));
app.get("/api-docs.json", (req, res) => res.json(openApiDoc));

app.use(errorHandler);

export default app;
