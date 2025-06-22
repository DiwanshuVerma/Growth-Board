import { Request, Response } from "express"
import { calculateUserStreaks } from "../services/habitStats"
import UserModel from "../models/User.model"
import HabitModel from "../models/Habit.model"


export async function getLeaderboard(req: Request, res: Response) {
  try {
    const users = await UserModel.find()

    const leaderboard = await Promise.all(
      users.map(async user => {
        const habits = await HabitModel.find({ user: user._id })

        let totalPoints = user.points
        const dailyCompletedDates: string[] = []

        for (const h of habits) {
            h.completedDates.forEach(d => {
              if (typeof d === 'string') {
                dailyCompletedDates.push(d)
              }
            })
        }

        const { longestStreak, currentStreak } = calculateUserStreaks(dailyCompletedDates)

        return {
          username: user.username,
          avatar: user.avatar,
          points: totalPoints,
          longestStreak,
          currentStreak,
        }
      })
    )

    leaderboard.sort((a, b) => b.points - a.points)
    res.status(200).json(leaderboard)
  } catch (err) {
    res.status(500).json({ error: 'Internal error' })
  }
}
