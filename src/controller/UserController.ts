import { Request, Response } from "express";
import { UserModel } from "../models/UserModel";

export const UserController = {
  async create(req: Request, res: Response): Promise<void> {
    try {
      const { id, name, lastname, cpf, rg, phone, email } = req.body;

      const existingUser = await UserModel.findOne({
        where: {
          $or: [{ cpf }, { rg }, { email }],
        },
      });

      if (existingUser) {
        res
          .status(400)
          .json({ msg: "User with the same CPF, RG or email already exists." });
      } else {
        const response = { id, name, lastname, cpf, rg, phone, email };
        await UserModel.create(response);
        res.status(201).json({ msg: "User created with sucessful!", response });
      }
    } catch (error) {
      res.status(500);
      console.log("error", error);
    }
  },
};
