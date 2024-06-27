import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const validateUser = [
  body("name")
    .isLength({ min: 1 })
    .withMessage("Name is required")
    .isLength({ max: 100 })
    .withMessage("Name must be less than 100 chars long"),
  body("lastname")
    .isLength({ min: 1 })
    .withMessage("Last name is required")
    .isLength({ max: 100 })
    .withMessage("Last name must be less than 100 chars long"),
  body("cpf")
    .isLength({ min: 11, max: 11 })
    .withMessage("CPF must be 11 chars long"),
  body("rg").isLength({ min: 9, max: 9 }).withMessage("RG is required"),
  body("phone")
    .isLength({ min: 11, max: 11 })
    .withMessage("Invalid phone number! The correct format is: 11900000000"),
  body("email").isEmail().withMessage("Invalid email address"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/\d/)
    .withMessage("Password must contain at least one number")
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage("Password must contain at least one special character"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
