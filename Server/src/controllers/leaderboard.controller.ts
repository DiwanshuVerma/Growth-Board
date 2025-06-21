import UserModel from "../models/User.model";
import HabitModel from "../models/Habit.model";
import { Request, Response } from "express";
import { getUserStreaks } from "../services/habitStats";

export async function getLeaderboard(req: Request, res: Response) {
    try {
        const users = await UserModel.find();

        const leaderboardData = await Promise.all(
            users.map(async (user) => {
                const habits = await HabitModel.find({ user: user._id });

                let allCompletedDates: string[] = [];

                for (const habit of habits) {
                    // Only consider Daily habits for streak calculation
                    if (habit.goalType === 'Daily') {
                        allCompletedDates = [...allCompletedDates, ...habit.completedDates];
                    }
                }

                const { currentStreak, longestStreak } = getUserStreaks(allCompletedDates);

                return {
                    _id: user._id,
                    username: user.username,
                    avatar: user.avatar,
                    points: user.points,
                    currentStreak,
                    longestStreak,
                };
            })
        );

        leaderboardData.sort((a, b) => b.points - a.points);

        res.status(200).json(leaderboardData);
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
}
