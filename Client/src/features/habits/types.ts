
export interface Habit {
  _id: string
  title: string
  description?: string
  goalType: 'Daily' | 'Weekly'
  targetStreak: number
  createdAt: string
  completedDates: string[]
}

export type ReduxHabit = Habit;