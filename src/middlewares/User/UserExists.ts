import { Request, Response, NextFunction } from "express";
import { UserModel } from "../../models/UserModel";

export async function userExists(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  const existingUser = await UserModel.findOne({
    $or: [{ cpf: req.body.cpf }, { email: req.body.email }],
  });

  if (existingUser?.cpf === req.body.cpf) {
    return res.status(400).json({
      message: "User with the same cpf already exists.",
    });
  }

  if (existingUser?.email === req.body.email) {
    return res.status(400).json({
      message: "User with the same email already exists.",
    });
  }

  next();
}
