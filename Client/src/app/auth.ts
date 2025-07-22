import { loginAsUser } from '@/features/auth/authSlice'
import axios from 'axios'
import { toast } from 'sonner'
import type { AppDispatch } from './store'

const backendURI = import.meta.env.VITE_BACKEND_API

interface Habit {
    title: string
    description?: string
    goalType: 'Daily' | 'Weekly'
    targetStreak: number
    createdAt: string
    completedDates: string[]
}

interface userDetails {
    email: string,
    password: string,
    username?: string
}

interface updateUserPayload {
    username?: string,
    avatar?: File
}

export const getCurrentUser = async () => {
    const stored = JSON.parse(localStorage.getItem("user") || "null")
    const token = stored?.token
    if (!token) throw new Error("No auth token")

    const res = await axios.get(`${backendURI}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
    })

    return res.data
}


export const userLogin = async ({ email, password }: userDetails) => {
    try {
        const res = await axios.post(`${backendURI}/users/login`, { email, password });
        toast.success(res.data.message, {
            style: {
                backgroundColor: '#aff8d4',
                border: "green",
                color: 'green',
            },
        });
        console.log(res);
        return res;
    } catch (err: any) {
        const errorMessage =
            err.response?.data?.message ||
            "Something went wrong. Please try again.";

        toast.error(errorMessage);
        console.error(err);
        throw err;
    }
};


export const sendOtp = async ({ email, password, username }: userDetails) => {
    try {
        const res = await axios.post(`${backendURI}/users/send-otp`, { email, password, username })
        toast.success(res.data.message, {
            style: {
                backgroundColor: '#aff8d4',
                border: "green",
                color: 'green',
            },
        })
        localStorage.setItem('otpToken', res.data.otpToken)

        return res.data.message
    }
    catch (err: any) {
        const errorMessage =
            err.response?.data?.message ||
            "Something went wrong. Please try again.";

        toast.error(errorMessage);
        console.error(err);
        throw err;
    }
}

export const verifyOtpAndRegister = async (otp: string) => {
    const otpToken = localStorage.getItem("otpToken")
    try {
        const res = await axios.post(`${backendURI}/users/verify-otp`, {
            otpToken,
            enteredOtp: otp
        })
        toast.success("Registered Successfully!", {
            style: {
                backgroundColor: "#aff8d4",
                color: "green"
            }
        })
        return res
    }
    catch (err: any) {
        const errorMessage =
            err.response?.data?.message ||
            "Something went wrong. Please try again.";

        toast.error(errorMessage);
        console.error(err);
        throw err;
    }
}


export const storeHabitsInDB = async (newHabit: Habit, dispatch: AppDispatch) => {
    const stored = JSON.parse(localStorage.getItem("user") || "null")
    const token = stored?.token

    if (!token) {
        toast.error("No auth token found; please log in again.", {
            style: {
                backgroundColor: "#aff8d4",
            }
        })
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

        const updatedUser = await getCurrentUser()

        dispatch(loginAsUser({ token: token, user: updatedUser }))
        localStorage.setItem("user", JSON.stringify({ token, user: updatedUser }))
        return res.data
    } catch (err) {
        console.error(err)
        throw err
    }
}

export const deleteDbHabit = async (habitId: string, dispatch: AppDispatch) => {
    const stored = JSON.parse(localStorage.getItem("user") || "null")
    const token = stored?.token

    if (!token) {
        toast.error("No auth token found; please log in again.", {
            style: {
                backgroundColor: "#aff8d4",
            }
        })
        throw new Error("No auth token found; please log in again.")
    }
    try {
        const res = await axios.delete(`${backendURI}/habits/delete/${habitId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })

        const updatedUser = await getCurrentUser()
        dispatch(loginAsUser({ token: token, user: updatedUser }))
        localStorage.setItem("user", JSON.stringify({ token, user: updatedUser }))
        return res.data
    } catch (error: any) {
        console.log(error)
        throw error
    }
}

export const updateDbHabit = async (habitId: string, updatedHabit: Habit, dispatch: AppDispatch) => {
    const stored = JSON.parse(localStorage.getItem("user") || "null")
    const token = stored?.token

    if (!token) {
        toast.error("No auth token found; please log in again.", {
            style: {
                backgroundColor: "#aff8d4",
            }
        })
        throw new Error("No auth token found; please log in again.")
    }

    try {
        const res = await axios.put(`${backendURI}/habits/update/${habitId}`, updatedHabit, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })

        const updatedUser = await getCurrentUser()
        dispatch(loginAsUser({ token: token, user: updatedUser }))
        localStorage.setItem("user", JSON.stringify({ token, user: updatedUser }))
        return res.data
    } catch (error: any) {
        console.log(error.message)
    }
}

export const fetchDbHabits = async (dispatch: AppDispatch) => {
    const stored = JSON.parse(localStorage.getItem("user") || "null")
    const userId = stored?.user._id
    const token = stored?.token
    try {
        const res = await axios.get(`${backendURI}/habits/bulk?userId=${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })

        const updatedUser = await getCurrentUser()
        dispatch(loginAsUser({ token: token, user: updatedUser }))
        localStorage.setItem("user", JSON.stringify({ token, user: updatedUser }))
        return res.data
    } catch (err: any) {
        const errorMessage =
            err.response?.data?.message ||
            "Something went wrong. Please try again.";

        toast.error(errorMessage);
        console.error(err);
        throw err;
    }
}


export const allUsers = async () => {
    try {
        const res = await axios.get(`${backendURI}/leaderboard`)
        return res.data
    }
    catch (Err) {
        console.log(Err)
    }
}

export const updateUser = async ({ username, avatar }: updateUserPayload, dispatch: AppDispatch) => {
    const stored = JSON.parse(localStorage.getItem("user") || "null")
    const token = stored?.token

    const formData = new FormData()
    if (username) formData.append('username', username)
    if (avatar) formData.append('avatar', avatar)

    try {
        const res = await axios.put(`${backendURI}/users/update`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": 'multipart/form-data'
            }
        })
        console.log(res)
        dispatch(loginAsUser({ token, user: { ...stored.user, username, avatar: res.data.user.avatar } }))
        localStorage.setItem('user', JSON.stringify({ token, user: { ...stored.user, username, avatar: res.data.user.avatar } }))

        toast.success(res.data.message, {
            style: {
                backgroundColor: '#aff8d4',
                border: "green",
                color: 'green',
            },
        })
        return res.data
    } catch (error: any) {
        toast.error(error?.response?.data?.message || "Something went wrong, try again later!")
    }
}