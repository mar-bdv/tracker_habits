import { configureStore } from "@reduxjs/toolkit";
import habitsReducer from "./habitsSlice";
import authReducer from "./authSlice";

export const store = configureStore({
    reducer: {
        habits: habitsReducer,
        auth: authReducer

    },
});