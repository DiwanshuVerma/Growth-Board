
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface Habit {
  id: string
  title: string
  description?: string
  goalType: 'Daily' | 'Weekly'
  targetStreak: number
  createdAt: string       // ISO timestamp
  completedDates: string[]
}

interface HabitState {
  activeHabits: Habit[]
  completedHabits: Habit[],
  source: 'local' | 'backend'
}

const initialState: HabitState = {
  activeHabits: [],
  completedHabits: [],
  source: 'local'  // default
}

const habitSlice = createSlice({
  name: 'habit',
  initialState,
  reducers: {
    setHabitSource: (state, action: PayloadAction<'local' | 'backend'>) => {
      state.source = action.payload
    },
    setAllHabits: (
      state,
      action: PayloadAction<{
        active: Habit[],
        completed: Habit[]
      }>
    ) => {
      state.activeHabits = action.payload.active,
        state.completedHabits = action.payload.completed
    },
    addHabit: (state, action: PayloadAction<Habit>) => {
      state.activeHabits.push(action.payload)
    },

    completeHabit: (state, action: PayloadAction<string>) => {
      const habitId = action.payload
      const index = state.activeHabits.findIndex((h) => h.id === habitId)
      if (index !== -1) {
        const [completed] = state.activeHabits.splice(index, 1)
        state.completedHabits.push(completed)
      }
    },

    undoCompleteHabit: (state, action: PayloadAction<string>) => {
      const habitId = action.payload
      const index = state.completedHabits.findIndex((h) => h.id === habitId)
      if (index !== -1) {
        const [restored] = state.completedHabits.splice(index, 1)
        state.activeHabits.push(restored)
      }
    },

    // Delete habit action
    deleteHabitAction: (state, action: PayloadAction<string>) => {
      const habitId = action.payload
      state.activeHabits = state.activeHabits.filter((h) => h.id !== habitId)
      state.completedHabits = state.completedHabits.filter(
        (h) => h.id !== habitId
      )
    },

    setActiveHabits: (state, action: PayloadAction<Habit[]>) => {
      state.activeHabits = action.payload
    },

    // Update habit action
    updateHabit: (state, action: PayloadAction<Habit>) => {
      const updatedHabit = action.payload

      // Update in active habits
      const activeIndex = state.activeHabits.findIndex(h => h.id === updatedHabit.id)
      if (activeIndex !== -1) {
        state.activeHabits[activeIndex] = updatedHabit
      }

      // Update in completed habits
      const completedIndex = state.completedHabits.findIndex(h => h.id === updatedHabit.id)
      if (completedIndex !== -1) {
        state.completedHabits[completedIndex] = updatedHabit
      }
    },
  },
})

export const {
  setHabitSource,
  setAllHabits,
  addHabit,
  completeHabit,
  undoCompleteHabit,
  deleteHabitAction,
  setActiveHabits,
  updateHabit,
} = habitSlice.actions

export default habitSlice.reducer