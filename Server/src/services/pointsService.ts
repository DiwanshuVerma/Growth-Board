import HabitModel from '../models/Habit.model'
import UserModel from '../models/User.model'
import mongoose from 'mongoose'
import { getCurrentStreak } from './habitStats'

export async function awardPointsForHabitCreation(habitId: string, userId: string) {
  // 1 point for creating
  await (await mongoose.startSession()).withTransaction(async (session) => {
    await HabitModel.findByIdAndUpdate(
      habitId,
      { $inc: { points: 1 } },
      { session }
    )
    await UserModel.findByIdAndUpdate(
      userId,
      { $inc: { points: 1 } },
      { session }
    )
  })
}

export async function awardPointsForCheckOff(
  habitId: string,
  userId: string,
  isToday: boolean,
  streakLength: number,
  isAdding: boolean // true for check, false for uncheck
) {
  const points = isAdding ? 2 : -2
  const ops: Array<{ model: any; filter: any; update: any }> = [
    { model: HabitModel, filter: { _id: habitId }, update: { $inc: { points } } },
    { model: UserModel, filter: { _id: userId }, update: { $inc: { points } } }
  ]

  if (streakLength === 3) {
    if (isAdding) {
      ops.push(
        { model: HabitModel, filter: { _id: habitId }, update: { $inc: { points: 5 } } },
        { model: UserModel, filter: { _id: userId }, update: { $inc: { points: 5 } } }
      )
    } else {
      ops.push(
        { model: HabitModel, filter: { _id: habitId }, update: { $inc: { points: -5 } } },
        { model: UserModel, filter: { _id: userId }, update: { $inc: { points: -5 } } }
      )
    }
  }

  if (streakLength === 5 && isToday) {
    if (isAdding) {
      ops.push(
        { model: HabitModel, filter: { _id: habitId }, update: { $inc: { points: 15 } } },
        { model: UserModel, filter: { _id: userId }, update: { $inc: { points: 15 } } }
      )
    } else {
      ops.push(
        { model: HabitModel, filter: { _id: habitId }, update: { $inc: { points: -15 } } },
        { model: UserModel, filter: { _id: userId }, update: { $inc: { points: -15 } } }
      )
    }
  }

  if (streakLength === 30 && isToday) {
    if (isAdding) {
      ops.push(
        { model: HabitModel, filter: { _id: habitId }, update: { $inc: { points: 70 } } },
        { model: UserModel, filter: { _id: userId }, update: { $inc: { points: 70 } } }
      )
    } else {
      ops.push(
        { model: HabitModel, filter: { _id: habitId }, update: { $inc: { points: -70 } } },
        { model: UserModel, filter: { _id: userId }, update: { $inc: { points: -70 } } }
      )
    }
  }

  const session = await mongoose.startSession()
  await session.withTransaction(async () => {
    for (const { model, filter, update } of ops) {
      await model.findOneAndUpdate(filter, update, { session })
    }
  })
  session.endSession()
}


export async function removeHabitAndRevokePoints(habitId: string, userId: string) {
  const habit = await HabitModel.findById(habitId)
  const user = await UserModel.findById(userId)

  if (!habit || !user) return

  const creationPoints = 1
  const streakPoints = getCurrentStreak(habit.completedDates, new Date().toISOString())

  const totalPointsToRemove = creationPoints + streakPoints

  user.points = Math.max(0, user.points - totalPointsToRemove)
  await user.save()
}