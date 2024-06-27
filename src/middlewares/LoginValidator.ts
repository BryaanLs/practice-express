import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { UserModel } from "../models/UserModel";
export function loginValidator(
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log(req.body.email);

  const userExists = UserModel.findOne({
    $or: [{ email: req.body.email }],
  });
  // console.log("variavel userExists: ", userExists);

  if (!userExists) {
    res.status(404).json({ msg: "User not found" });
  }

  res.send(userExists);
}
