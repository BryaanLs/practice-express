import { Router } from "express";
import userRoutes from "./UserRoutes";
import loginRoute from "./LoginRoute";

const routes = Router();

routes.use("/api", userRoutes);
routes.use("/api", loginRoute);

export { routes };
