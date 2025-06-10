import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

const initialState = {
    isGuest: false,
    token: null as string | null,
    user: null as any
}

const authSlice = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {
        loginAsGuest(state) {
            state.isGuest = true
        },
        loginAsUser(state, action: PayloadAction<{ token: string, user: any }>) {
            state.isGuest = false,
                state.token = action.payload.token,
                state.user = action.payload.user
        },
        logout(state) {
            state.isGuest = false
            state.token = null
            state.user = null
        }
    }
})

export const { loginAsGuest, loginAsUser, logout } = authSlice.actions
export default authSlice.reducer