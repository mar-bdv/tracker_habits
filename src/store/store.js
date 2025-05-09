import { configureStore } from "@reduxjs/toolkit";
import habitsReducer from "./habitsSlice";
import authReducer from "./authSlice";
import categoriesReducer from "./categoriesSlice";

export const store = configureStore({
    reducer: {
        habits: habitsReducer,
        auth: authReducer,
        categories: categoriesReducer,
    },
});