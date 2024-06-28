import { Router } from "express";
import userRoutes from "./UserRoutes";

const routes = Router();

routes.use("/api", userRoutes);

export { routes };
