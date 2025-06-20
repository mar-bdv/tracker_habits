import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../supabaseClient";



export const fetchCategories = createAsyncThunk(
    "categories/fetchCategories",
    async (userId, thunkAPI) => {
        const { data: hidden, error: hiddenError } = await supabase
            .from("user_hidden_categories")
            .select("category_id")
            .eq("user_id", userId);
    
        if (hiddenError) return thunkAPI.rejectWithValue(hiddenError.message);
    
        const hiddenIds = hidden.map((item) => item.category_id);
    
        let query = supabase
            .from("categories")
            .select("*")
            .or(`user_id.eq.${userId},is_system.eq.true`);
    
        if (hiddenIds.length > 0) {
            query = query.not("id", "in", `(${hiddenIds.join(",")})`);
        }
    
        const { data, error } = await query;
    
        if (error) return thunkAPI.rejectWithValue(error.message);
        return data;
        }
);



export const addCategory = createAsyncThunk(
    "categories/addCategory",
    async ({ name, userId }, thunkAPI) => {
        const { data, error } = await supabase
        .from("categories")
        .insert([{ name, user_id: userId }])
        .select();
        if (error) return thunkAPI.rejectWithValue(error.message);
        return data[0];
    }
);


export const hideCategoryForUser = createAsyncThunk(
    "categories/hideCategoryForUser",
    async ({ userId, categoryId }, thunkAPI) => {
        const { error } = await supabase
            .from("user_hidden_categories")
            .insert([{ user_id: userId, category_id: categoryId }]);
        if (error) return thunkAPI.rejectWithValue(error.message);
        return categoryId;
    }
);

export const deleteCategory = createAsyncThunk(
    "categories/deleteCategory",
    async (categoryId, thunkAPI) => {
        const { error } = await supabase
            .from("categories")
            .delete()
            .eq("id", categoryId);
        if (error) return thunkAPI.rejectWithValue(error.message);
        return categoryId;
    }
);

const categoriesSlice = createSlice({
    name: "categories",
    initialState: {
        categories: [],
        status: "idle",
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(fetchCategories.pending, (state) => {
            state.status = "loading";
        })
        .addCase(fetchCategories.fulfilled, (state, action) => {
            state.status = "succeeded";
            state.categories = action.payload;
        })
        .addCase(fetchCategories.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.payload;
        })
        .addCase(addCategory.fulfilled, (state, action) => {
            state.categories.push(action.payload);
        })

        .addCase(hideCategoryForUser.fulfilled, (state, action) => {
            state.categories = state.categories.filter(c => c.id !== action.payload);
        })
        .addCase(deleteCategory.fulfilled, (state, action) => {
            state.categories = state.categories.filter(c => c.id !== action.payload);
        });
    },
});

export default categoriesSlice.reducer;
