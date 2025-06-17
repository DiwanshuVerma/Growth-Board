import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Habit } from './types'

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
      state.activeHabits = action.payload.active || [];
      state.completedHabits = action.payload.completed || [];
    },
    addHabit: (state, action: PayloadAction<Habit>) => {
      const newHabit = action.payload;
      if (!newHabit) return

      state.activeHabits = [
        ...(state.activeHabits || []).filter(h => h !== undefined),
        newHabit
      ];
    },

    completeHabit: (state, action: PayloadAction<Habit>) => {
      const habit = action.payload
      state.activeHabits = state.activeHabits.filter(h => h._id !== habit._id)
      state.completedHabits.push(habit)
    },

    // Delete habit action
    deleteHabitAction: (state, action: PayloadAction<string>) => {
      const habitId = action.payload;

      state.activeHabits = state.activeHabits
        .filter(h => h !== undefined)
        .filter(h => h._id !== habitId);

      state.completedHabits = state.completedHabits
        .filter(h => h !== undefined)
        .filter(h => h._id !== habitId);
    },
    setActiveHabits: (state, action: PayloadAction<Habit[]>) => {
      state.activeHabits = action.payload
    },

    // Update habit action
    updateHabit: (state, action: PayloadAction<Habit>) => {
      const updatedHabit = action.payload

      // Update in active habits
      const activeIndex = state.activeHabits.findIndex(h => h._id === updatedHabit._id)
      if (activeIndex !== -1) {
        state.activeHabits[activeIndex] = updatedHabit
      }

      // Update in completed habits
      const completedIndex = state.completedHabits.findIndex(h => h._id === updatedHabit._id)
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
  deleteHabitAction,
  setActiveHabits,
  updateHabit,
} = habitSlice.actions

export default habitSlice.reducer