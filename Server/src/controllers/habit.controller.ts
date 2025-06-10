import { RequestHandler, Response } from "express";
import HabitModel from "../models/Habit.model";
import { AuthenticatedRequest } from "../types/AuthenticatedRequest";

export const createHabit = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" })
  }
  try {
    const newHabit = await HabitModel.create({
      ...req.body,
      user: req.user._id,
    })
    res.json({ message: "Habit created successfully", newHabit })
  } catch (err: any) {
    res.status(400).json({ message: "Error while creating habit", error: err.message })
  }
}

export const allHabits: RequestHandler = async (req, res) => {
    try {
        const habits = await HabitModel.find({ user: req.query.userId })
        res.json(habits)
    } catch (error: any) {
        res.status(400).json(error.message)
    }
}

export const updateHabit: RequestHandler = async (req, res) => {
    try {
        const findHabit = await HabitModel.findByIdAndUpdate(req.params._id, req.body, { new: true })
        res.json({ message: "Habit updated succesfull", findHabit })
    } catch (error: any) {
        res.status(400).json(error.message)
    }
}

export const deleteHabit: RequestHandler = async (req, res) => {
    try {
        await HabitModel.findByIdAndDelete(req.params._id)
        res.status(200).json({ message: "Habit deleted" });

    } catch (err: any) {
        res.status(400).json(err.message)
    }
}
