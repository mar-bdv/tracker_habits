import { createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../../supabase/supabaseClient";

// ✅ Регистрация пользователя
export const signUpUser = createAsyncThunk(
  "auth/signUpUser",
  async ({ email, password, nickname }, thunkAPI) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nickname } },
    });

    if (error) return thunkAPI.rejectWithValue(error.message);

    await supabase.from("users").insert([{ id: data.user.id, email, nickname }]);

    localStorage.setItem("user", JSON.stringify(data.user));
    return data.user;
  }
);


// ✅ Вход пользователя
export const signInUser = createAsyncThunk(
  "auth/signInUser",
  async ({ email, password }, thunkAPI) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return thunkAPI.rejectWithValue(error.message);

    localStorage.setItem("user", JSON.stringify(data.user));
    return data.user;
  }
);

// ✅ Выход из аккаунта
export const signOutUser = createAsyncThunk("auth/signOutUser", async (_, thunkAPI) => {
  const { error } = await supabase.auth.signOut();
  if (error) return thunkAPI.rejectWithValue(error.message);

  localStorage.removeItem("user");
  return null;
});
