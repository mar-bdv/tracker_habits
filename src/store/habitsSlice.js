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

// export const addHabit = createAsyncThunk(
//   'habits/addHabit',
//   async (habitData, thunkAPI) => {
//     console.log("Отправляем привычку:", habitData); // <-- Добавь это

//     const { data, error } = await supabase
//       .from('habits')
//       .insert([habitData]);

//     const { data: sessionData } = await supabase.auth.getSession();
//     console.log("auth.uid():", sessionData?.session?.user?.id);
//     console.log("habitData.user_id:", habitData.user_id);

//     if (error) {
//       console.error("Ошибка при добавлении привычки:", error.message); // <-- Лог ошибки
//       return thunkAPI.rejectWithValue(error.message);
//     }

//     return data;
//   }
// );

export const addHabit = createAsyncThunk(
  "habits/addHabit",
  async (habitData, thunkAPI) => {
    const { data, error } = await supabase
      .from("habits")
      .insert(habitData)
      .select();

    if (error) {
      return thunkAPI.rejectWithValue(error.message);
    }

    return data; // обязательно верни массив с новой привычкой
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
    const state = thunkAPI.getState();
    console.log("state внутри updateHabit:", state);

    const userId = state.auth?.user?.id;

    const { data, error } = await supabase
      .from('habits')
      .upsert([
        {
          ...updatedHabitData,
          user_id: updatedHabitData.user_id || userId, // сохраняем user_id
        },
      ])
      .eq('user_id', userId);

      console.log(updatedHabitData)

    if (error) {
      return thunkAPI.rejectWithValue(error.message);
    }

    return data;
  }
);

export const toggleHabit = createAsyncThunk(
  'habits/toggleHabit',
  async ({ userId, habitId, completed }, thunkAPI) => {
    const { data, error } = await supabase
      .from('habits')
      .update({ completed }) // обновляем поле completed
      .eq('id', habitId)
      .eq('user_id', userId);

    if (error) {
      return thunkAPI.rejectWithValue(error.message);
    }

    return { habitId, completed }; // возвращаем только нужное
  }
);



const habitsSlice = createSlice({
  name: "habits",
  initialState: {
    habits: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchHabits.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchHabits.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.habits = action.payload;
      })
      .addCase(fetchHabits.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // ADD
      .addCase(addHabit.fulfilled, (state, action) => {
        if (action.payload && action.payload.length > 0) {
          state.habits.push(action.payload[0]); // ← добавляем сразу!
        }
      })

      .addCase(updateHabit.fulfilled, (state, action) => {
        const updatedHabit = action.payload?.[0];
        if (!updatedHabit) return;
        const index = state.habits.findIndex((h) => h.id === updatedHabit.id);
        if (index !== -1) {
          state.habits[index] = updatedHabit; // Заменяем старую привычку на обновлённую
        }
      })

      .addCase('habits/updateHabitImmediate', (state, action) => {
        const updatedHabit = action.payload;
        const index = state.habits.findIndex((h) => h.id === updatedHabit.id);
        if (index !== -1) {
            state.habits[index] = updatedHabit; // Немедленно обновляем привычку в стейте
        }
    });
  },
});

export default habitsSlice.reducer;
