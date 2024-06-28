import { Schema, model, Document } from "mongoose";

interface User extends Document {
  id: string;
  name: string;
  lastname: string;
  cpf: number;
  rg: number;
  phone: number;
  email: string;
  password: string;
}

const UserSchema = new Schema({
  id: { type: Schema.Types.ObjectId },
  name: { type: String, require: true },
  lastname: { type: String, require: true },
  cpf: { type: Number, require: true, unique: true },
  rg: { type: Number, require: true, unique: true },
  phone: { type: Number, require: false },
  email: { type: String, require: true, unique: true },
  password: { type: String, require: true },
});

const UserModel = model<User>("User", UserSchema);

export { UserModel };
