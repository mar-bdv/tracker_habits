import { configureStore } from "@reduxjs/toolkit";
import habitsReducer from "./habitsSlice";
import authReducer from "./authSlice";
import categoriesReducer from "./categoriesSlice";
import moodsReducer from "./moodsSlice";
import streakReducer from "./streakSlice";

export const store = configureStore({
    reducer: {
        habits: habitsReducer,
        auth: authReducer,
        categories: categoriesReducer,
        moods: moodsReducer,
        streak: streakReducer,
    },
});