import { Router } from "express";
import { loginValidator } from "../middlewares/LoginValidator";
import { UserController } from "../controller/UserController";
import { validateUser } from "../middlewares/ValidationUser";

const userRoutes = Router();

userRoutes.post("/user/register", validateUser, UserController.create);
userRoutes.post("/user/login", loginValidator, UserController.login);

export default userRoutes;
