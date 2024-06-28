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
      const { id, name, lastname, cpf, rg, phone, email, password } = req.body;

      const existingUser = await UserModel.findOne({
        $or: [{ cpf }, { rg }, { email }],
      });

      if (existingUser) {
        return res.status(400).json({
          msg: "User with the same CPF, RG or email already exists.",
        });
      } else {
        const response = {
          id,
          name,
          lastname,
          cpf,
          rg,
          phone,
          email,
          password,
        };

        const hashSaltPassword = await bcrypt.genSalt(10);
        response.password = await bcrypt.hash(
          response.password,
          hashSaltPassword
        );

        const { password: pass, ...user } = response;

        const credentials: JwtResponse = await createJwtToken(user);

        await UserModel.create({ ...user, password: pass });

        return res.status(201).json({
          msg: "User created successfully!",
          user,
          credentials,
        });
      }
    } catch (error) {
      return res.status(500).json({ msg: "Internal server error", error });
    }
  },
  async login(req: Request, res: Response): Promise<Response> {
    const { user } = req.body;
    const isMatch = await bcrypt.compare(req.body.password, user.password);

    if (!isMatch) {
      return res.status(401).json({ msg: "Unauthorized" });
    }
    const { _id, name, lastname, cpf, rg, phone, email }: JwtPayload =
      user.toObject();
    const jwtPayload: JwtPayload = {
      _id,
      name,
      lastname,
      cpf,
      rg,
      phone,
      email,
    };
    const credentials: JwtResponse = await createJwtToken(jwtPayload);
    return res.status(200).json({ msg: "User Authorized", credentials });
  },
};
