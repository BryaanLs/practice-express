import { Request, Response } from "express";
import { UserModel } from "../models/UserModel";
import bcrypt from "bcryptjs";
import { config } from "dotenv";
import { JwtResponse, JwtPayload } from "../types/types";
import { createJwtToken } from "../services/JwtAuth";
import transporter from "../services/Nodemailer";
import redisClient from "../db/redisConnection";
import { randomUUID } from "crypto";
config({ path: "../.env" });

export const UserController = {
  async register(req: Request, res: Response): Promise<Response> {
    try {
      const hashSaltPassword = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(
        req.body.password,
        hashSaltPassword
      );

      const uuid = randomUUID();

      const { password, ...user } = req.body;
      const redisPayload = { ...req.body, referenceId: uuid };
      await redisClient.setEx(uuid, 3600, JSON.stringify(redisPayload));
      const token: JwtResponse = await createJwtToken(user, 60);
      const url = `http://localhost:3000/confirmation/${token}`;

      const info = await transporter.sendMail({
        to: req.body.email,
        subject: "Confirme seu cadastro",
        html: `Clique no link para confirmar seu cadastro: <a href="${url}">${url}</a>`,
      });
      return res.status(200).json({ message: "Confirmation email sent", info });
    } catch (error) {
      console.log(error);

      return res.status(500).json({ message: "Internal server error", error });
    }
  },

  async confirmation(req: Request, res: Response): Promise<Response> {
    try {
      await UserModel.create({ ...req.body });
      return res.status(200);
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
    const credentials: JwtResponse = await createJwtToken(jwtPayload, 60);
    return res.status(200).json({ message: "User Authorized", credentials });
  },
};
