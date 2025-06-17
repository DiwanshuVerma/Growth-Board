
export interface Habit {
  _id: string
  title: string
  description?: string
  goalType: 'Daily' | 'Weekly'
  targetStreak: number
  createdAt: string       // ISO timestamp
  completedDates: string[],
  status: 'active' | 'completed'
}

export type ReduxHabit = Habit;