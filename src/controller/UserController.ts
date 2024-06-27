import { Request, Response } from "express";
import { UserModel } from "../models/UserModel";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { config } from "dotenv";
import { JwtResponse } from "../types/types";
import { createJwtToken } from "../services/JwtAuth";
config({ path: "../.env" });

export const UserController = {
  async create(req: Request, res: Response): Promise<void> {
    try {
      const { id, name, lastname, cpf, rg, phone, email, password } = req.body;

      // Verifique se um usuário já existe com o mesmo CPF, RG ou email
      const existingUser = await UserModel.findOne({
        $or: [{ cpf }, { rg }, { email }],
      });
      // console.log(existingUser);

      if (existingUser) {
        res.status(400).json({
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

        res.status(201).json({
          msg: "User created successfully!",
          user,
          credentials,
        });
      }
    } catch (error) {
      res.status(500).json({ msg: "Internal server error", error });
      console.log("error", error);
    }
  },
};
