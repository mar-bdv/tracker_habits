import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../supabaseClient";
import { updateUserStreak } from "./streakSlice";
import { useDispatch } from "react-redux";


export const addHabit = createAsyncThunk(
  "habits/addHabit",
  async (habitData, thunkAPI) => {
    const { category, ...rest } = habitData;

    let categoryId = null;

    if (category) {
      const { data: foundCategory, error: categoryError } = await supabase
        .from("categories")
        .select("id")
        .eq("name", category)
        .maybeSingle();

      if (categoryError) {
        return thunkAPI.rejectWithValue("Ошибка поиска категории: " + categoryError.message);
      }

      if (!foundCategory) {
        return thunkAPI.rejectWithValue("Категория не найдена: " + category);
      }

      categoryId = foundCategory.id;
    }

    const { data, error } = await supabase
      .from("habits")
      .insert({ ...rest, category_id: categoryId })
      .select(`
        *,
        categories (
          name
        )
      `);

    if (error) {
      return thunkAPI.rejectWithValue(error.message);
    }

    // Вернём с названием категории
    const newHabit = data[0];
    return {
      ...newHabit,
      category: newHabit.categories?.name || "",
    };
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
      // 1️⃣ Получаем привычки вместе с категорией и выполнениями
      const { data: habits, error: habitsError } = await supabase
        .from("habits")
        .select(`
          *,
          categories ( name ),
          habit_completions ( habit_id, date )
        `)
        .eq("user_id", userId);

      if (habitsError) throw habitsError;

      // 2️⃣ Преобразуем массив habit_completions в объект completedDates
      const habitsWithDates = habits.map(habit => {
        const completedDates = (habit.habit_completions || []).reduce(
          (acc, { date }) => ({ ...acc, [date]: true }),
          {}
        );
        return {
          ...habit,
          category: habit.categories?.name || "",
          completedDates,
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
  async (habitData, thunkAPI) => {
    const { id, title, notes, deadline, user_id, category } = habitData;

    // Найдём id категории по имени
    let categoryId = null;

    if (category) {
      const { data: categories, error: categoryError } = await supabase
        .from("categories")
        .select("id")
        .eq("name", category)
        .maybeSingle();

      if (categoryError) {
        return thunkAPI.rejectWithValue("Ошибка поиска категории: " + categoryError.message);
      }

      categoryId = categories?.id || null;
    }

    // Обновим привычку
    const { data, error } = await supabase
      .from("habits")
      .update({
        title,
        notes,
        deadline,
        user_id,
        category_id: categoryId,
        category: category, // можно оставить, если нужно дублирование для быстрого отображения
      })
      .eq("id", id)
      .select(`
        *,
        categories (
          name
        )
      `)
      .maybeSingle();

    if (error) {
      return thunkAPI.rejectWithValue("Ошибка обновления привычки: " + error.message);
    }

    // Вернём привычку с названием категории
    return {
      ...data,
      category: data.categories?.name || "",
    };
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
    const { dispatch } = thunkAPI;
    
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

      await dispatch(updateUserStreak(userId));

      return { habitId, date, completed: false }; // Выполнение убирается
    } else {
      // Если записи нет, добавляем новую
      const { error: insertError } = await supabase
        .from('habit_completions')
        .insert([{ user_id: userId, habit_id: habitId, date }]);

      if (insertError) return thunkAPI.rejectWithValue(insertError.message);
      
      await thunkAPI.dispatch(updateUserStreak(userId));

      return { habitId, date, completed: true }; // Выполнение добавляется
    }
  }
);

export const fetchHabitCompletions = createAsyncThunk(
  'habits/fetchHabitCompletions',
  async ({ userId, date }, thunkAPI) => {
    const { data, error } = await supabase
      .from('habit_completions')
      .select('*')
      .eq('user_id', userId)
      .eq('date', date); // загружаем выполненные на конкретную дату

    if (error) return thunkAPI.rejectWithValue(error.message);
    return data;
  }
);


const habitsSlice = createSlice({
  name: "habits",
  initialState: {
    habits: [],
    status: "idle",
    error: null,
    completions: [],
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

        state.habits.push(action.payload);

      })

      .addCase(updateHabit.fulfilled, (state, action) => {
        const updatedHabit = action.payload;
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

      .addCase(fetchHabitCompletions.fulfilled, (state, action) => {
        state.completions = action.payload;
      })


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
