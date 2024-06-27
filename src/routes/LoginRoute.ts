import { Router } from "express";
import { loginValidator } from "../middlewares/LoginValidator";

const loginRoute = Router();

loginRoute.post("/login", loginValidator);

export default loginRoute;
