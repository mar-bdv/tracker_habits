import { createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "./supabaseClient";

// ✅ Добавление привычки
export const addHabit = createAsyncThunk(
  "habits/addHabit",
  async ({ title, category, notes, progress, userId }, thunkAPI) => {
    const { data, error } = await supabase.from("habits").insert([
      { title, category, notes, progress, user_id: userId },
    ]);

    if (error) return thunkAPI.rejectWithValue(error.message);

    return data;
  }
);

// ✅ Получение привычек пользователя
export const getUserHabits = createAsyncThunk(
  "habits/getUserHabits",
  async (userId, thunkAPI) => {
    const { data, error } = await supabase
      .from("habits")
      .select("*")
      .eq("user_id", userId);

    if (error) return thunkAPI.rejectWithValue(error.message);

    return data;
  }
);
