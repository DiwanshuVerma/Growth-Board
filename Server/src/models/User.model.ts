import mongoose, { Schema, Document, model } from "mongoose"

export interface IUser extends Document {
  username: string
  displayName?: string
  email?: string
  password?: string
  avatar: string
  twitterId?: string
  points: number
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true },
  displayName: { type: String },
  email: { type: String },
  password: { type: String },
  avatar: { type: String, required: true },
  twitterId: { type: String },
  points: { type: Number, default: 0 },
})

const UserModel = model<IUser>("User", userSchema)
export default UserModel

