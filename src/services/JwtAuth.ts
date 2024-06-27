import jwt from "jsonwebtoken";
import { JwtPayload, JwtResponse } from "../types/types";
export async function createJwtToken(
  payload: JwtPayload
): Promise<JwtResponse> {
  const jwtToken = jwt.sign(payload, process.env.SECRET_KEY as string, {
    expiresIn: `${5 * 60 * 1000}ms`,
  });

  const jwtResponse: JwtResponse = {
    token: jwtToken,
    type: "Bearer",
  };

  return jwtResponse;
}
