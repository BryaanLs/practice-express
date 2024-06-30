import { Schema, model, Document } from "mongoose";

interface User extends Document {
  name: string;
  lastname: string;
  cpf: string;
  phone: string;
  email: string;
  password: string;
}

const UserSchema = new Schema({
  name: { type: String, require: true },
  lastname: { type: String, require: true },
  cpf: { type: String, require: true, unique: true },
  phone: { type: String, require: false },
  email: { type: String, require: true, unique: true },
  password: { type: String, require: true },
});

const UserModel = model<User>("User", UserSchema);

export { UserModel };
