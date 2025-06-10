import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  showLoginForm: false,
  showLogoutForm: false,
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleLoginForm: (state) => {
      state.showLoginForm = !state.showLoginForm;
    },
    setLoginForm: (state, action) => {
      state.showLoginForm = action.payload;
    },
    toggleLogoutForm: (state) => {
      state.showLogoutForm = !state.showLogoutForm;
    },
    setLogoutForm: (state, action) => {
      state.showLogoutForm = action.payload;
    },
  },
});

export const { toggleLoginForm, setLoginForm, toggleLogoutForm, setLogoutForm } = uiSlice.actions;
export default uiSlice.reducer;
