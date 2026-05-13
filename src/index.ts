import express from "express";
import cors from "cors";
import userRoutes from "./modules/user/user.route.js";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/users", userRoutes);

app.use(errorHandler);

export default app;
