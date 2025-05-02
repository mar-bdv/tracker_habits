import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../supabaseClient";


// export const addHabit = createAsyncThunk(
//   "habits/addHabit",
//   async (habitData, thunkAPI) => {
//     const state = thunkAPI.getState();
//     const userId = state.auth?.user?.id;

//     const { data, error } = await supabase
//       .from("habits")
//       .insert([{ ...habitData, user_id: userId }])
//       .select();

//     if (error) return thunkAPI.rejectWithValue(error.message);
//     return data;
//   }
// );


// export const deleteHabit = createAsyncThunk(
//   "habits/deleteHabit",
//   async (habitId, thunkAPI) => {
//     const { error } = await supabase.from("habits").delete().eq("id", habitId);
//     if (error) return thunkAPI.rejectWithValue(error.message);
//     return habitId;
//   }
// );

// export const fetchHabits = createAsyncThunk(
//   'habits/fetchHabits',
//   async ({ userId, date }, thunkAPI) => {
//     try {
//       const today = date || new Date().toISOString().split('T')[0];

//       const { data: habits, error: habitsError } = await supabase
//         .from('habits')
//         .select('*')
//         .eq('user_id', userId);

//       if (habitsError) return thunkAPI.rejectWithValue(habitsError.message);

//       const { data: completions, error: completionsError } = await supabase
//         .from('habit_completions')
//         .select('habit_id')
//         .eq('user_id', userId)
//         .eq('date', today);

//       if (completionsError) return thunkAPI.rejectWithValue(completionsError.message);

//       const completedIds = completions.map(c => c.habit_id);

//       const filteredHabits = habits.filter(habit => {
//         if (!habit.deadline) return true;
//         return today <= habit.deadline;
//       });

//       const habitsWithCompleted = filteredHabits.map(habit => ({
//         ...habit,
//         completed: completedIds.includes(habit.id),
//       }));

//       return habitsWithCompleted;
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error.message);
//     }
//   }
// );

// export const updateHabit = createAsyncThunk(
//   'habits/updateHabit',
//   async (updatedHabitData, thunkAPI) => {
//     const state = thunkAPI.getState();
//     const userId = state.auth?.user?.id;

//     const { data, error } = await supabase
//       .from('habits')
//       .upsert([
//         {
//           ...updatedHabitData,
//           user_id: updatedHabitData.user_id || userId,
//         },
//       ])
//       .select();

//     if (error) return thunkAPI.rejectWithValue(error.message);
//     return data;
//   }
// );

// export const toggleHabitForDate = createAsyncThunk(
//   'habits/toggleHabitForDate',
//   async ({ userId, habitId, date }, thunkAPI) => {
//     const { data, error } = await supabase
//       .from('habit_completions')
//       .select('*')
//       .eq('user_id', userId)
//       .eq('habit_id', habitId)
//       .eq('date', date);

//     if (error) return thunkAPI.rejectWithValue(error.message);

//     if (data.length > 0) {
//       const { error: deleteError } = await supabase
//         .from('habit_completions')
//         .delete()
//         .eq('id', data[0].id);
//       if (deleteError) return thunkAPI.rejectWithValue(deleteError.message);
//       return { habitId, date, completed: false };
//     } else {
//       const { error: insertError } = await supabase
//         .from('habit_completions')
//         .insert([{ user_id: userId, habit_id: habitId, date }]);
//       if (insertError) return thunkAPI.rejectWithValue(insertError.message);
//       return { habitId, date, completed: true };
//     }
//   }
// );

// const habitsSlice = createSlice({
//   name: "habits",
//   initialState: {
//     habits: [],
//     status: "idle",
//     error: null,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchHabits.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(fetchHabits.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.habits = action.payload;
//       })
//       .addCase(fetchHabits.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload;
//       })
//       .addCase(addHabit.fulfilled, (state, action) => {
//         if (action.payload?.length > 0) {
//           state.habits.push(action.payload[0]);
//         }
//       })
//       .addCase(updateHabit.fulfilled, (state, action) => {
//         const updatedHabit = action.payload?.[0];
//         if (!updatedHabit) return;
//         const index = state.habits.findIndex((h) => h.id === updatedHabit.id);
//         if (index !== -1) {
//           state.habits[index] = updatedHabit;
//         }
//       })
//       .addCase(toggleHabitForDate.fulfilled, (state, action) => {
//         const { habitId, completed } = action.payload;
//         const habit = state.habits.find(h => h.id === habitId);
//         if (habit) habit.completed = completed;
//       })
//       .addCase(deleteHabit.fulfilled, (state, action) => {
//         state.habits = state.habits.filter(habit => habit.id !== action.payload);
//       });
//   },
// });

// export default habitsSlice.reducer;


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

export const fetchHabits = createAsyncThunk(
  "habits/fetchHabits",
  async (userId, thunkAPI) => {
    try {
      // 1) забираем все привычки
      const { data: habits, error: habitsError } = await supabase
        .from("habits")
        .select("*")
        .eq("user_id", userId);
      if (habitsError) throw habitsError;

      // 2) забираем все отметки выполнения
      const { data: completions, error: completionsError } = await supabase
        .from("habit_completions")
        .select("habit_id, date")
        .eq("user_id", userId);
      if (completionsError) throw completionsError;

      // 3) собираем completedDates для каждой привычки
      const habitsWithDates = habits.map(habit => {
        const dates = completions
          .filter(c => c.habit_id === habit.id)
          .reduce((acc, c) => {
            acc[c.date] = true;
            return acc;
          }, {});
        return {
          ...habit,
          completedDates: dates,  // объект вида { "2025-04-20": true, ... }
        };
      });

      return habitsWithDates;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);


export const updateHabit = createAsyncThunk(
  "habits/updateHabit",
  async (updatedHabitData, thunkAPI) => {
    try {
      const userId = thunkAPI.getState().auth.user.id;
      const { id, title, notes, category, deadline } = updatedHabitData;

      // Обновляем конкретную привычку
      const { data, error } = await supabase
        .from("habits")
        .update({
          title,
          notes,
          category,
          deadline,
          user_id: userId,    // если нужно перезаписать владельца
        })
        .eq("id", id)
        .select();            // чтобы получить обновлённую строку

      if (error) throw error;

      // data — это массив, берем первый элемент
      return data[0];
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
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


export const toggleHabitForDate = createAsyncThunk(
  'habits/toggleHabitForDate',
  async ({ userId, habitId, date }, thunkAPI) => {
    const { data, error } = await supabase
      .from('habit_completions')
      .select('*')
      .eq('user_id', userId)
      .eq('habit_id', habitId)
      .eq('date', date);  // Проверяем, существует ли запись на эту дату

    if (error) return thunkAPI.rejectWithValue(error.message);

    if (data.length > 0) {
      // Если запись уже существует, удаляем её
      const { error: deleteError } = await supabase
        .from('habit_completions')
        .delete()
        .eq('id', data[0].id);

      if (deleteError) return thunkAPI.rejectWithValue(deleteError.message);

      return { habitId, date, completed: false }; // Выполнение убирается
    } else {
      // Если записи нет, добавляем новую
      const { error: insertError } = await supabase
        .from('habit_completions')
        .insert([{ user_id: userId, habit_id: habitId, date }]);

      if (insertError) return thunkAPI.rejectWithValue(insertError.message);

      return { habitId, date, completed: true }; // Выполнение добавляется
    }
  }
);


const habitsSlice = createSlice({
  name: "habits",
  initialState: {
    habits: [],
    status: "idle",
    error: null,
  },
  reducers: {
    updateHabitImmediate: (state, action) => {
      const index = state.habits.findIndex(habit => habit.id === action.payload.id);
      if (index !== -1) {
        state.habits[index] = { ...state.habits[index], ...action.payload };
      }
    },
  },
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
    })

    // .addCase(toggleHabitForDate.fulfilled, (state, action) => {
    //   const { habitId, completed } = action.payload;
    //   const habit = state.habits.find(h => h.id === habitId);
    //   if (habit) {
    //     habit.completed = completed;
    //   }
    // })
    .addCase(deleteHabit.fulfilled, (state, action) => {
      state.habits = state.habits.filter(habit => habit.id !== action.payload);
    })
    
    .addCase(toggleHabitForDate.fulfilled, (state, action) => {
      const { habitId, completed, date } = action.payload;
      const habit = state.habits.find(h => h.id === habitId);
      if (habit) {
        // Для каждой привычки добавляем флаг выполнения для конкретной даты
        if (!habit.completedDates) habit.completedDates = {}; // Создаем объект для дат, если его нет
        habit.completedDates[date] = completed;  // Сохраняем состояние выполнения для конкретной даты
      }
    })
    
  },
});

export const { updateHabitImmediate } = habitsSlice.actions;

export default habitsSlice.reducer;
