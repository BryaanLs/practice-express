export type JwtResponse = {
  token: string;
  type: "Bearer";
  expiresAt?: string;
  refreshToken?: string;
};

export type JwtPayload = {
  _id?: string;
  name: string;
  lastname: string;
  cpf: number;
  rg: number;
  phone: number;
  email: string;
};
