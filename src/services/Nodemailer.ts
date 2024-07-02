import nodemailer from "nodemailer";
import util from "util";
import { config } from "dotenv";
config({ path: "../.env" });

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_ADMIN,
    pass: process.env.PASS_ADMIN,
  },
});

transporter.sendMail = util.promisify(transporter.sendMail);
export default transporter;
