import type { Habit } from '@/features/habits/habitSlice'
import axios from 'axios'
import { toast } from 'sonner'

interface userDetails {
    email: string,
    password: string,
    username?: string
}
const backendURI = 'http://localhost:5000'

export const userLogin = async ({ email, password }: userDetails) => {
    try {
        const res = await axios.post(`${backendURI}/users/login`, { email, password })

        const { token, user, avatar } = res.data
        localStorage.setItem("user", JSON.stringify({ token, user, avatar }))
        localStorage.removeItem("guest")
        toast(res.data.message)
        return res.data
    }
    catch (err: any) {
        toast(err.message)
        // console.log(err)
        throw err
    }
}

export const sendOtp = async ({ email, password, username }: userDetails) => {
    try {
        const res = await axios.post(`${backendURI}/users/send-otp`, { email, password, username })
        toast(res.data.message)
        localStorage.setItem('otpToken', res.data.otpToken)

        return res.data.message
    }
    catch (err: any) {
        toast(err.response.data.message)
        throw err
    }
}

export const verifyOtpAndRegister = async (otp: string) => {
    const otpToken = localStorage.getItem("otpToken")

    try {
        const res = await axios.post(`${backendURI}/users/verify-otp`, {
            otpToken,
            enteredOtp: otp
        })
        const { token, user, avatar } = res.data
        localStorage.setItem("user", JSON.stringify({ token, user, avatar }))
        localStorage.removeItem("guest")
    }
    catch (err: any) {
        toast(err.response.data.message)
        throw err
    }
}


export const storeHabitsInDB = async (newHabit: Habit) => {
  const stored = JSON.parse(localStorage.getItem("user") || "null")
  const token = stored?.token

  if (!token) {
    throw new Error("No auth token found; please log in again.")
  }

  try {
    const res = await axios.post(
      `${backendURI}/habits/create`,
      newHabit,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    console.log(res.data)
    return res.data
  } catch (err) {
    console.error(err)
    throw err
  }
}


export const deleteDbHabit = async (habitId: string) => {
    try {
        const res = await axios.delete(`${backendURI}/habits/delete/${habitId}`)
        return res.data
    } catch (error: any) {
        console.log(error)
        throw error
    }
}
export const updateDbHabit = async (habitId: string, updatedHabit: Habit) => {
    try {
        const res = await axios.put(`${backendURI}/habits/update/${habitId}`, updatedHabit)

        return res.data
    } catch (error: any) {
        console.log(error.message)
    }
}

export const fetchDbHabits = async () => {
   const stored = JSON.parse(localStorage.getItem("user") || "null")
   const userId = stored?.user._id
  const token = stored?.token

    try {
        const res = await axios.get(`${backendURI}/habits/bulk?userId=${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        return res.data
    } catch (err: any) {
        throw err
    }
}
