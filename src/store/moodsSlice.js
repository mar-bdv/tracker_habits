import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../supabaseClient';
import { getLocalDateString } from '../utils/date';

// Загрузка настроения на сегодня
export const fetchTodayMood = createAsyncThunk(
    'moods/fetchTodayMood',
    async (userId) => {
        const today = getLocalDateString(new Date());
        const { data, error } = await supabase
        .from('moods')
        .select('*')
        .eq('user_id', userId)
        .eq('date', today)
        .single();

        if (error && error.code !== 'PGRST116') throw error; // PGRST116 = не найдено
        return data || null;
    }
);

// Отправка настроения
export const setTodayMood = createAsyncThunk(
    'moods/setTodayMood',
    async ({ userId, mood }) => {
        const today = getLocalDateString(new Date());

        // upsert — если есть, обновит; если нет — вставит
        const { data, error } = await supabase
        .from('moods')
        .upsert({ user_id: userId, mood, date: today }, { onConflict: ['user_id', 'date'] })
        .select()
        .single();

        if (error) throw error;
        return data;
    }
);

export const fetchMoodsByMonth = createAsyncThunk(
    'moods/fetchMoodsByMonth',
    async ({ userId, year, month }) => {
        const startDate = new Date(year, month, 1);
        const endDate = new Date(year, month + 1, 0);
        
        const { data, error } = await supabase
        .from('moods')
        .select('*')
        .eq('user_id', userId)
        .gte('date', getLocalDateString(startDate))
        .lte('date', getLocalDateString(endDate));

        if (error) throw error;
        return data;
    }
);

const moodsSlice = createSlice({
    name: 'moods',
    initialState: {
        todayMood: null,
        status: 'idle',
        error: null,
        moodsByDate: {},
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(fetchTodayMood.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(fetchTodayMood.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.todayMood = action.payload;
        })
        .addCase(fetchTodayMood.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
        })
        .addCase(setTodayMood.fulfilled, (state, action) => {
            state.todayMood = action.payload;
        })
        .addCase(fetchMoodsByMonth.fulfilled, (state, action) => {
            const moodsMap = {};
            action.payload.forEach(entry => {
                moodsMap[entry.date] = entry.mood;
            });
            state.moodsByDate = moodsMap;
        });
    }
});

export default moodsSlice.reducer;
