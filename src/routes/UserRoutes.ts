import { Router } from "express";
import { UserController } from "../controller/UserController";
import { validateUser } from "../middlewares/ValidationUser";

const userRoutes = Router();

userRoutes.post("/user", validateUser, UserController.create);

export default userRoutes;
