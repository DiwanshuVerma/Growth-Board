import { Request } from "express"
import { IUser } from "../models/User.model"
import mongoose from "mongoose"

export interface AuthenticatedRequest extends Request {
  user?: IUser & { _id: mongoose.Types.ObjectId }
}
  