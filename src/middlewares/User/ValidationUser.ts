import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { userValidate } from "../../validations/userValidate";
import validate from "validation-br";
export async function validateUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  try {
    userValidate.parse(req.body);

    const { cpf } = req.body;
    if (!validate.isCPF(cpf)) {
      return res
        .status(400)
        .json({ message: `This CPF: ${cpf} is not valid!` });
    }
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      const formattedErrors = error.errors.map((err) => ({
        message: err.message,
        field: err.path[0],
      }));

      return res.status(400).json({ errors: formattedErrors });
    }

    return res.status(500).json({ message: "Internal server error", error });
  }
}
