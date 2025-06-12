import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { supabase } from "../supabaseClient";


function fmt(date) {
    return date.toISOString().slice(0,10);
}

export const updateUserStreak = createAsyncThunk(
    "streak/updateUserStreak",
    async (userId, thunkAPI) => {
        try {
        const today = new Date();
        const todayStr = fmt(today);

        const { data: existing, error: eErr } = await supabase
            .from("streaks")
            .select("updated_at")
            .eq("user_id", userId)
            .maybeSingle();
        if (eErr) throw eErr;
        if (existing?.updated_at && fmt(new Date(existing.updated_at)) === todayStr) {
            return thunkAPI.rejectWithValue("already_updated_today");
        }

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


        .addCase(updateUserStreak.fulfilled, (state, action) => {
            state.count = action.payload;
        })
        .addCase(updateUserStreak.rejected, (state, action) => {
            if (action.payload !== "already_updated_today") {
            state.error = action.payload;
            }
        });
    }
});


export default streakSlice.reducer;