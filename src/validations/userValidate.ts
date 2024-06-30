import { z } from "zod";

export const userValidate = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 chars long"),
  lastname: z
    .string()
    .min(1, "Last name is required")
    .max(100, "Last name must be less than 100 chars long"),
  cpf: z.string().length(11, "CPF must be 11 chars long"),
  phone: z
    .string()
    .length(11, "Invalid phone number! The correct format is: 11900000000"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/\d/, "Password must contain at least onecoisa basic number")
    .regex(
      /([!@#$%^&*(),.?":{}|<>].*?){2}/,
      "Password must contain at least two special characters"
    ),
});
