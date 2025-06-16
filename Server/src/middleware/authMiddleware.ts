import jwt from "jsonwebtoken"
import { Request, Response, NextFunction, RequestHandler } from "express"
import User from "../models/User.model"
import { JWT_SECRET } from "../config/env"

interface CustomRequest extends Request {
  user?: any
}

export const verifyToken: RequestHandler = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "No token provided" })
    return
  }

  const token = authHeader.split(" ")[1]

  try {
    const decoded: any = jwt.verify(token, JWT_SECRET!)
    const user = await User.findById(decoded.userId).select("-password")

    if (!user) {
      res.status(401).json({ message: "User not found, middleware" })
      return
    }

    req.user = user
    next()
  } catch (err) {
    res.status(401).json({ message: "Invalid token" })
  }
}
