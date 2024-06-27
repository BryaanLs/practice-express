import { Schema, model } from "mongoose";

const UserSchema = new Schema({
  id: { type: Schema.Types.ObjectId },
  name: {
    type: String,
    require: true,
  },
  lastname: {
    type: String,
    require: true,
  },
  cpf: {
    type: Number,
    require: true,
    unique: true,
  },
  rg: {
    type: Number,
    require: true,
    unique: true,
  },
  phone: {
    type: Number,
    require: false,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    select: false,
    require: true,
  },
});

const UserModel = model("User", UserSchema);

export { UserModel };
