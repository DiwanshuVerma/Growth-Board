import { RequestHandler, Response } from "express";
import HabitModel from "../models/Habit.model";
import { IUser } from "../models/User.model";
import { AuthenticatedRequest } from "../types/AuthenticatedRequest";
import { awardPointsForCheckOff, awardPointsForHabitCreation, removeHabitAndRevokePoints } from "../services/pointsService";
import mongoose from "mongoose";
import { getCurrentStreak } from "../services/habitStats";

// Simple assertion helper

function assertUser(user: any): asserts user is IUser & { _id: mongoose.Types.ObjectId } {
  if (!user || typeof user !== "object" || !("_id" in user)) {
    throw new Error("Invalid user object")
  }
}

//  CREATE 
export const createHabit = async (req: AuthenticatedRequest, res: Response) => {

  if (!req.user) return res.status(401).json({ message: "Unauthorized" })

  try {
    const newHabit = await HabitModel.create({
      ...req.body,
      user: req.user._id,
      createdAt: new Date().toISOString(),
    })

    assertUser(req.user)

    // award 1 point for creation
    await awardPointsForHabitCreation(newHabit._id.toString(), req.user._id.toString())

    res.status(201).json({ message: "Habit created successfully", habit: newHabit })
  } catch (err: any) {
    res.status(400).json({ message: "Error creating habit", error: err.message })
  }
}

//  GET ALL 
export const allHabits = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" })

  try {
    const habits = await HabitModel.find({ user: req.user._id })
    res.json(habits)
  } catch (err: any) {
    res.status(400).json({ message: err.message })
  }
}

//  UPDATE 
export const updateHabit = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" })

  const habitId = req.params._id
  try {
    const existing = await HabitModel.findById(habitId)
    if (!existing || existing.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: "Habit not found" })
    }

    const newDates: string[] | undefined = (req.body as any).completedDates
    if (Array.isArray(newDates)) {
      const oldDates = existing.completedDates

      const added = newDates.filter(d => !oldDates.includes(d))
      const removed = oldDates.filter(d => !newDates.includes(d))

      // handle added (check-offs)
      for (const iso of added) {
        const streakLength = getCurrentStreak(newDates, iso)
        const isToday = iso === new Date().toISOString().slice(0, 10)
        await awardPointsForCheckOff(
          habitId,
          req.user._id.toString(),
          isToday,
          streakLength,
          true
        )
      }

      // handle removed (uncheck-offs)
      for (const iso of removed) {
        const streakLength = getCurrentStreak(oldDates, iso)
        const isToday = iso === new Date().toISOString().slice(0, 10)
        await awardPointsForCheckOff(
          habitId,
          req.user._id.toString(),
          isToday,
          streakLength,
          false // remove points
        )
      }
    }

    const updated = await HabitModel.findByIdAndUpdate(
      habitId,
      req.body,
      { new: true }
    )

    res.json({ message: "Habit updated successfully", habit: updated })
  } catch (err: any) {
    res.status(400).json({ message: "Error updating habit", error: err.message })
  }
}


//  DELETE 
export const deleteHabit = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" })

  const habitId = req.params._id
  try {
    // 1) Ensure exists & owned by user
    const existing = await HabitModel.findById(habitId)
    if (!existing || existing.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: "Habit not found" })
    }

    // 2) Remove and revoke all points earned by this habit
    await removeHabitAndRevokePoints(habitId, req.user._id.toString())

    res.json({ message: "Habit deleted and points revoked" })
  } catch (err: any) {
    res.status(400).json({ message: "Error deleting habit", error: err.message })
  }
}