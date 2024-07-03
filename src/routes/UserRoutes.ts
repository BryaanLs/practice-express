import { Router } from "express";
import { UserController } from "../controller/UserController";
import { loginValidator } from "../middlewares/User/LoginValidator";
import { validateUser } from "../middlewares/User/ValidationUser";
import { userExists } from "../middlewares/User/UserExists";

const userRoutes = Router();

userRoutes.post(
  "/user/register",
  validateUser,
  userExists,
  UserController.register
);
userRoutes.get("/user/confirmation/:token", UserController.confirmation);
userRoutes.post("/user/login", loginValidator, UserController.login);

export default userRoutes;
