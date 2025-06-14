import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface AuthState {
    isGuest: boolean;
    token: string | null;
    user: any | null;
}

const initialState: AuthState = {
    isGuest: false,
    token: null,
    user: null
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginAsGuest(state) {
            state.isGuest = true;
            state.token = null;
            state.user = null;
        },
        loginAsUser(state, action: PayloadAction<{ token: string, user: any }>) {
            state.isGuest = false;
            state.token = action.payload.token;
            state.user = action.payload.user;
        },
        logout(state) {
            state.isGuest = false;
            state.token = null;
            state.user = null;
        }
    }
})

export const { loginAsGuest, loginAsUser, logout } = authSlice.actions
export default authSlice.reducer