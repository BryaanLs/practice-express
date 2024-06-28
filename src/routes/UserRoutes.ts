import { Router } from "express";
import { UserController } from "../controller/UserController";
import { loginValidator } from "../middlewares/LoginValidator";
import { validateUser } from "../middlewares/ValidationUser";

const userRoutes = Router();

userRoutes.post("/user/register", validateUser, UserController.create);
userRoutes.post("/user/login", loginValidator, UserController.login);

export default userRoutes;
