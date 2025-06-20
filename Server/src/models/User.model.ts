import mongoose, { Schema, Document, model } from "mongoose"

export interface IUser extends Document {
  username: string
  email: string
  password: string
  avatar: string
  points: number
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  avatar: { type: String, required: true },
  points: { type: Number, default: 0 },
})

const UserModel = model<IUser>("User", userSchema)

export default UserModel
