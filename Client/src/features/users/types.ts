export interface User {
    _id: string
    username: string
    displayName: string
    email: string
    password: string
    avatar: string
    points: number
    currentStreak: number
    longestStreak: number
}