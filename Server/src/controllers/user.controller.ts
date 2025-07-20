import { RequestHandler, Response } from 'express'
import User from '../models/User.model'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { JWT_SECRET } from '../config/env'
import { transporter } from '../config/mailer' // for sending OTP emails
import { AuthenticatedRequest } from '../types/AuthenticatedRequest'

enum ResponseStatus {
  success = 200,
  notFound = 404,
  invalid = 401
}

export const getCurrentUser = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" })

  try {
    const user = await User.findById(req.user._id)
    if (!user) return res.status(404).json({ message: "User not found" })

    res.status(200).json(user)
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching user", error: error.message })
  }
}


// Check if user exists, if not → send OTP
export const sendOtp: RequestHandler = async (req, res) => {
  const { email, username, password } = req.body

  const existingUser = await User.findOne({ email })
  const existingUsername = await User.findOne({ username })
  if (existingUser) {
    res.status(401).json({ message: 'Email already exists. Proceed to login.' })
    return
  }
  if (existingUsername) {
    res.status(401).json({ message: 'Username already exists' })
    return
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString()

  const token = jwt.sign({ email, username, password, otp }, JWT_SECRET, { expiresIn: '10m' })

  await transporter.sendMail({
    to: email,
    from: process.env.EMAIL_USER!,
    subject: 'GrowthBoard OTP Code',
    html: `<h3>Your GrowthBoard OTP is ${otp}</h3>
         <p>Expires in: 10 minute</p>`
  });

  res.status(200).json({ message: 'OTP sent to email', otpToken: token })
}

// Verify OTP and create user
export const verifyOtpAndCreateUser: RequestHandler = async (req, res) => {
  const { otpToken, enteredOtp } = req.body

  try {
    const decoded = jwt.verify(otpToken, JWT_SECRET) as any
    const { email, username, password, otp } = decoded

    if (enteredOtp !== otp) {
      res.status(400).json({ message: 'Invalid or Expired OTP' })
      return
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const seed = encodeURIComponent(email)
    const avatarUrl = `https://api.dicebear.com/9.x/adventurer/svg?seed=${seed}`

    const newUser = await User.create({ email, username, password: hashedPassword, avatar: avatarUrl })

    const authToken = jwt.sign({ userId: newUser._id }, JWT_SECRET)

    res.status(201).json({ message: 'User created', user: newUser, token: authToken })
  } catch (error: any) {
    res.status(401).json({ message: 'Invalid or expired OTP token', error: error.message })
  }
}

export const loginWithEmail: RequestHandler = async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })
  if (!user) {
    res.status(404).json({ message: 'User not found. Please register.' })
    return
  }

  if (!user.password) {
    res.status(500).json({ message: 'User record is corrupted. No password found.' })
    return
  }

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    res.status(400).json({ message: 'Incorrect password' })
    return
  }

  const token = jwt.sign({ userId: user._id }, JWT_SECRET)
  res.status(200).json({ message: 'Login successful', user, token })
}

export const Allusers: RequestHandler = async (req, res) => {
  try {
    const users = await User.find()
    res.status(200).json(users)
  }
  catch (err: any) {
    res.status(400).json(err.message)
  }
}