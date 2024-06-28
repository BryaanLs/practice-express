import { Request, Response, NextFunction } from "express";
import { UserModel } from "../models/UserModel";

export async function loginValidator(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  const user = await UserModel.findOne({ email: req.body.email });

  if (!user) {
    return res.status(404).json({ msg: "User not found" });
  } else {
    req.body = { ...req.body, user };
    next();
  }
}
