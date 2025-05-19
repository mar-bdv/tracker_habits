// store/streakSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { supabase } from "../supabaseClient";


// вспомогательная функция: форматируем Date → 'YYYY-MM-DD'
function fmt(date) {
    return date.toISOString().slice(0,10);
}


// export const updateUserStreak = createAsyncThunk(
//     "streak/updateUserStreak",
//     async (userId, thunkAPI) => {
//         try {
//         const today = new Date();
//         const todayStr = fmt(today);

//         // 0️⃣ Проверяем, был ли уже сегодня апдейт стрэйка
//         const { data: existingStreak, error: fetchError } = await supabase
//             .from("streaks")
//             .select("updated_at")
//             .eq("user_id", userId)
//             .maybeSingle();

//         if (fetchError) throw fetchError;

//         if (existingStreak?.updated_at) {
//             const lastUpdate = new Date(existingStreak.updated_at);
//             const lastUpdateStr = fmt(lastUpdate);

//             if (lastUpdateStr === todayStr) {
//             // Уже обновлялся сегодня — не пересчитываем стрэйк
//             return thunkAPI.rejectWithValue("already_updated_today");
//             }
//         }

//         // 1️⃣ Получаем все даты с выполнениями за последние 60 дней
//         const { data: comps, error: compErr } = await supabase
//             .from("habit_completions")
//             .select("date")
//             .eq("user_id", userId)
//             .gte("date", fmt(new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)))
//             .order("date", { ascending: false });

//         if (compErr) throw compErr;

//         const done = new Set(comps.map((c) => fmt(new Date(c.date))));

//         // 2️⃣ Считаем текущий streak
//         let streak = 0,
//             cur = new Date(today);
//         let allowTodaySkip = !done.has(todayStr);

//         while (true) {
//             const ds = fmt(cur);
//             if (done.has(ds)) {
//             streak++;
//             cur.setDate(cur.getDate() - 1);
//             } else if (streak === 0 && allowTodaySkip) {
//             allowTodaySkip = false;
//             streak++;
//             cur.setDate(cur.getDate() - 1);
//             } else {
//             break;
//             }
//         }

//         // 3️⃣ Обновляем таблицу streaks
//         const { error: upErr } = await supabase
//             .from("streaks")
//             .upsert(
//             { user_id: userId, count: streak, updated_at: today.toISOString() },
//             { onConflict: ["user_id"] }
//             );

//         if (upErr) throw upErr;

//         return streak;
//         } catch (e) {
//         return thunkAPI.rejectWithValue(e.message);
//         }
//     }
// );

export const updateUserStreak = createAsyncThunk(
    "streak/updateUserStreak",
    async (userId, thunkAPI) => {
        try {
        const today = new Date();
        const todayStr = fmt(today);

        // 0️⃣ Если мы уже сегодня апдейтали стрэйк, выходим:
        const { data: existing, error: eErr } = await supabase
            .from("streaks")
            .select("updated_at")
            .eq("user_id", userId)
            .maybeSingle();
        if (eErr) throw eErr;
        if (existing?.updated_at && fmt(new Date(existing.updated_at)) === todayStr) {
            // уже были сегодня
            return thunkAPI.rejectWithValue("already_updated_today");
        }

        // 1️⃣ Собираем все даты с выполнениями за 60 дней
        const { data: comps, error: compErr } = await supabase
            .from("habit_completions")
            .select("date")
            .eq("user_id", userId)
            .gte("date", fmt(new Date(Date.now() - 60*24*60*60*1000)))
            .order("date", { ascending: false });
        if (compErr) throw compErr;

        const doneSet = new Set(comps.map(c => fmt(new Date(c.date))));
        let streak = 0, cur = new Date(today), allowSkip = !doneSet.has(todayStr);

        while (true) {
            const d = fmt(cur);
            if (doneSet.has(d)) {
            streak++;
            cur.setDate(cur.getDate() - 1);
            } else if (streak === 0 && allowSkip) {
            allowSkip = false;
            streak++;
            cur.setDate(cur.getDate() - 1);
            } else {
            break;
            }
        }

        // 2️⃣ Пишем или обновляем в streaks
        const { error: upErr } = await supabase
            .from("streaks")
            .upsert(
            { user_id: userId, count: streak, updated_at: today.toISOString() },
            { onConflict: ["user_id"] }
            );
        if (upErr) throw upErr;

        return streak;
        } catch (err) {
        return thunkAPI.rejectWithValue(err.message);
        }
    }
);



// export const fetchUserStreak = createAsyncThunk(
//     "streak/fetchUserStreak",
//     async (userId, thunkAPI) => {
//         try {
//         const { data, error } = await supabase
//             .from("streaks")
//             .select("count")
//             .eq("user_id", userId)
//             .maybeSingle();
//         if (error) throw error;
//         return data?.count ?? 0;
//         } catch (e) {
//         return thunkAPI.rejectWithValue(e.message);
//         }
//     }
// );


export const fetchUserStreak = createAsyncThunk(
    "streak/fetchUserStreak",
    async (userId, thunkAPI) => {
        try {
        const { data, error } = await supabase
            .from("streaks")
            .select("count")
            .eq("user_id", userId)
            .maybeSingle();
        if (error) throw error;
        return data?.count ?? 0;
        } catch (e) {
        return thunkAPI.rejectWithValue(e.message);
        }
    }
);

export const streakSlice = createSlice({
    name: "streak",
    initialState: { count: 0, status: "idle", error: null },
    reducers: {},
    extraReducers: (builder) => {
        // ONLY fetchUserStreak controls status/loading UI
        builder
        .addCase(fetchUserStreak.pending, (state) => {
            state.status = "loading";
        })
        .addCase(fetchUserStreak.fulfilled, (state, action) => {
            state.status = "succeeded";
            state.count = action.payload;
        })
        .addCase(fetchUserStreak.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.payload;
        })

        // updateUserStreak only updates count when fulfilled,
        // but does NOT affect `status`
        .addCase(updateUserStreak.fulfilled, (state, action) => {
            state.count = action.payload;
        })
        // if we rejected because "already_updated_today", ignore
        .addCase(updateUserStreak.rejected, (state, action) => {
            if (action.payload !== "already_updated_today") {
            state.error = action.payload;
            }
        });
    }
});


// export const streakSlice = createSlice({
//     name: "streak",
//     initialState: { count: 0, status: "idle", error: null },
//     reducers: {},
//     extraReducers: (builder) => {
//         builder
//         .addCase(updateUserStreak.pending, (state) => {
//             state.status = "loading";
//         })
//         .addCase(updateUserStreak.fulfilled, (state, action) => {
//             state.status = "succeeded";
//             state.count = action.payload;
//         })
//         .addCase(updateUserStreak.rejected, (state, action) => {
//             if (action.payload === "already_updated_today") {
//                 state.status = "idle"; // не показываем ошибку
//             } else {
//                 state.status = "failed";
//                 state.error = action.payload;
//             }
//         })

//         .addCase(fetchUserStreak.pending, (state) => {
//             state.status = "loading";
//         })
//         .addCase(fetchUserStreak.fulfilled, (state, action) => {
//             state.status = "succeeded";
//             state.count = action.payload;
//         })
//         .addCase(fetchUserStreak.rejected, (state, action) => {
//             state.status = "failed";
//             state.error = action.payload;
//         })
//     },
// });


export default streakSlice.reducer;