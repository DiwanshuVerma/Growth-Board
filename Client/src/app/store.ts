import { configureStore } from '@reduxjs/toolkit'
import  uiReducer  from '../features/ui/uiSlice'
import  authReducer  from '../features/auth/authSlice'
import habitReducer from '../features/habits/habitSlice'

const store = configureStore({
  reducer: {
    ui: uiReducer,
    auth: authReducer,
    habit: habitReducer
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store