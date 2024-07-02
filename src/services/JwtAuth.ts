import jwt from "jsonwebtoken";
import { JwtPayload, JwtResponse } from "../types/types";
export async function createJwtToken(
  payload: JwtPayload,
  minutes: number
): Promise<JwtResponse> {
  const jwtToken = jwt.sign(payload, process.env.SECRET_KEY as string, {
    expiresIn: `${minutes * 60 * 1000}ms`,
  });

  const jwtResponse: JwtResponse = {
    token: jwtToken,
    type: "Bearer",
  };

  return jwtResponse;
}
