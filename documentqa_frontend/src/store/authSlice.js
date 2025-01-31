import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status: localStorage.getItem("authToken") ? "authenticated" : "unauthenticated",
    userData: null
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            state.status = "authenticated";
            state.userData = action.payload
        },
        logout: (state) => {
            state.status = "unauthenticated";
            state.userData = null
        }
    }
})

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;