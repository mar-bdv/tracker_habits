import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../supabaseClient";


// export const addHabit = createAsyncThunk(
//   'habits/addHabit',
//   async (habitData, thunkAPI) => {
//     console.log("Отправляем привычку:", habitData); // <-- Добавь это

//     const { data, error } = await supabase
//       .from('habits')
//       .insert([habitData]);

//     if (error) {
//       console.error("Ошибка при добавлении привычки:", error.message); // <-- Лог ошибки
//       return thunkAPI.rejectWithValue(error.message);
//     }

//     return data;
//   }
// );

export const addHabit = createAsyncThunk(
  'habits/addHabit',
  async (habitData, thunkAPI) => {
    console.log("Отправляем привычку:", habitData); // <-- Добавь это

    const { data, error } = await supabase
      .from('habits')
      .insert([habitData]);

    if (error) {
      console.error("Ошибка при добавлении привычки:", error.message); // <-- Лог ошибки
      return thunkAPI.rejectWithValue(error.message);
    }

    return data;
  }
);

// Удаление привычки
export const deleteHabit = createAsyncThunk(
  "habits/deleteHabit",
  async (habitId, thunkAPI) => {
    const { error } = await supabase.from("habits").delete().eq("id", habitId);
    if (error) return thunkAPI.rejectWithValue(error.message);
    return habitId;
  }
);


// Асинхронное действие для получения привычек пользователя
export const fetchHabits = createAsyncThunk(
  'habits/fetchHabits',
  async (userId, thunkAPI) => {
    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', userId); // Получаем привычки для текущего пользователя

    if (error) {
      return thunkAPI.rejectWithValue(error.message);
    }

    return data; // Возвращаем данные привычек
  }
);


export const updateHabit = createAsyncThunk(
  'habits/updateHabit',
  async (updatedHabitData, thunkAPI) => {
    const { data, error } = await supabase
      .from('habits')
      .upsert([updatedHabitData])  // Используем upsert для обновления, если привычка уже существует
      .eq('id', updatedHabitData.id);

    if (error) {
      return thunkAPI.rejectWithValue(error.message);
    }

    return data;
  }
);

// Создание слайса для привычек
const habitsSlice = createSlice({
  name: 'habits',
  initialState: {
    habits: [],
    status: 'idle', // или 'loading', 'succeeded', 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHabits.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchHabits.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.habits = action.payload;
      })
      .addCase(fetchHabits.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});



export default habitsSlice.reducer;
