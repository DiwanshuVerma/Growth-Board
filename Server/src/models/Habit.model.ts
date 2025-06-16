import mongoose, { Schema } from "mongoose";

const HabitSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    goalType: { type: String, enum: ['Daily', 'Weekly'], required: true, default: 'Daily' },
    targetStreak: { type: Number, required: true },
    createdAt: { type: String, required: true },
    completedDates: { type: [String], required: true, default: []  },
    points: {type: Number, required: true, default: 0},
    user: { type: Schema.Types.ObjectId, ref: "User", required: true }
})

export default mongoose.model("Habit", HabitSchema)