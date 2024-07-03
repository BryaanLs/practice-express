import { Request, Response } from "express";
import { UserModel } from "../models/UserModel";
import bcrypt from "bcryptjs";
import { JwtResponse, JwtPayload } from "../types/types";
import { createJwtToken } from "../services/JwtAuth";
import transporter from "../services/Nodemailer";
import { redisClient } from "../db/redisConnection";
import { randomUUID } from "crypto";
import jwt from "jsonwebtoken";
import path from "path";
import ejs from "ejs";
import { config } from "dotenv";
import { envPath } from "../env/environment";
config({ path: envPath });

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

      const jwtPayload: JwtResponse = await createJwtToken(
        { ...user, referenceId: uuid },
        60
      );
      const url = `${process.env.BASE_URL}/api/user/confirmation/${jwtPayload.token}`;

      const templatePath = path.join(
        __dirname,
        "../templates/confirmationEmail.ejs"
      );
      const html = await ejs.renderFile(templatePath, {
        url,
      });

      const info = await transporter.sendMail({
        to: req.body.email,
        subject: "Confirme seu cadastro",
        html,
      });
      return res.status(200).json({
        message: `Confirmation email sent to: ${req.body.email}`,
        info: { messageId: info.messageId },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal server error", error });
    }
  },

  async confirmation(req: Request, res: Response): Promise<Response> {
    try {
      const { token } = req.params;

      const decoded: any = jwt.verify(token, process.env.SECRET_KEY as string);

      const userData = await redisClient.get(decoded.referenceId);
      if (!userData) {
        return res.status(400).json({
          message:
            "Invalid or expired token, try again or contact our support: zlucason1@gmail.com",
        });
      }

      const { referenceId, password, ...user } = JSON.parse(userData);

      await UserModel.create({ ...user, password });
      return res.status(200).json({
        msg: "User created with sucessful!",
        userData: { ...user },
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
    const credentials: JwtResponse = await createJwtToken(jwtPayload, 60);
    return res.status(200).json({ message: "User Authorized", credentials });
  },
};
