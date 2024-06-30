import { Request, Response } from "express";
import { UserModel } from "../models/UserModel";

import bcrypt from "bcryptjs";
import { config } from "dotenv";
import { JwtResponse, JwtPayload } from "../types/types";
import { createJwtToken } from "../services/JwtAuth";
config({ path: "../.env" });

export const UserController = {
  async create(req: Request, res: Response): Promise<Response> {
    try {
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

      const { password, ...user } = req.body;
      const hashSaltPassword = await bcrypt.genSalt(10);
      const hashedPass = await bcrypt.hash(password, hashSaltPassword);

      const credentials: JwtResponse = await createJwtToken(user);

      await UserModel.create({ ...user, password: hashedPass });

      return res.status(201).json({
        message: "User created successfully!",
        user,
        credentials,
      });
    } catch (error) {
      console.log(error);

      return res.status(500).json({ message: "Internal server error", error });
    }
  },

  async login(req: Request, res: Response): Promise<Response> {
    const { user } = req.body;
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { name, lastname, cpf, phone, email }: JwtPayload = user;
    const jwtPayload: JwtPayload = {
      name,
      lastname,
      cpf,
      phone,
      email,
    };
    const credentials: JwtResponse = await createJwtToken(jwtPayload);
    return res.status(200).json({ message: "User Authorized", credentials });
  },
};
