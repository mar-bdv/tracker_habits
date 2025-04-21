
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { supabase } from "../supabaseClient";

// export const signUpUser = createAsyncThunk(
//   'auth/signUpUser',
//   async ({ email, password, nickname }, thunkAPI) => {
//     const { data, error } = await supabase.auth.signUp({
//       email,
//       password,
//       options: {
//         data: { nickname },
//       },
//     });

//     if (error) return thunkAPI.rejectWithValue(error.message);

//     const { error: userError } = await supabase
//       .from('users')
//       .insert([{ id: data.user.id, email, nickname }]);

//     if (userError) return thunkAPI.rejectWithValue(userError.message);

//     return data.user;
//   }
// );


// // Вход
// export const signInUser = createAsyncThunk(
//   "auth/signInUser",
//   async ({ email, password }, thunkAPI) => {
//     const { data, error } = await supabase.auth.signInWithPassword({
//       email,
//       password,
//     });

//     if (error) return thunkAPI.rejectWithValue(error.message);

//     return data.user;
//   }
// );

// // Выход
// export const signOutUser = createAsyncThunk("auth/signOutUser", async () => {
//   await supabase.auth.signOut();
//   return null;
// });

// // Получение текущего пользователя
// export const getCurrentUser = createAsyncThunk(
//   "auth/getCurrentUser",
//   async (_, thunkAPI) => {
//     const { data, error } = await supabase.auth.getUser();
//     if (error) return thunkAPI.rejectWithValue(error.message);
//     return data.user;
//   }
// );

// // Создание Slice
// const authSlice = createSlice({
//   name: "auth",
//   initialState: { user: null, loading: false, error: null },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(signUpUser.fulfilled, (state, action) => {
//         state.user = action.payload;
//       })
//       .addCase(signInUser.fulfilled, (state, action) => {
//         state.user = action.payload;
//       })
//       .addCase(getCurrentUser.fulfilled, (state, action) => {
//         state.user = action.payload;
//       })
//       .addCase(signOutUser.fulfilled, (state) => {
//         state.user = null;
//       });
//   },
// });

// export default authSlice.reducer;


import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../supabaseClient";

// Регистрация
export const signUpUser = createAsyncThunk(
  'auth/signUpUser',
  async ({ email, password, nickname }, thunkAPI) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nickname },
      },
    });

    if (error) return thunkAPI.rejectWithValue(error.message);

    const user = data.user;

    const { error: userError } = await supabase
      .from('users')
      .insert([{ id: user.id, email, nickname }]);

    if (userError) return thunkAPI.rejectWithValue(userError.message);

    return {
      id: user.id,
      email: user.email,
      nickname: user.user_metadata?.nickname || '',
    };
  }
);

// Вход
export const signInUser = createAsyncThunk(
  "auth/signInUser",
  async ({ email, password }, thunkAPI) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return thunkAPI.rejectWithValue(error.message);

    const user = data.user;

    return {
      id: user.id,
      email: user.email,
      nickname: user.user_metadata?.nickname || '',
    };
  }
);

// Выход
export const signOutUser = createAsyncThunk("auth/signOutUser", async () => {
  await supabase.auth.signOut();
  return null;
});

// Получение текущего пользователя
export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, thunkAPI) => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) return thunkAPI.rejectWithValue(error?.message || 'No user');

    const user = data.user;

    return {
      id: user.id,
      email: user.email,
      nickname: user.user_metadata?.nickname || '',
    };
  }
);

// Слайс авторизации
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signUpUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUpUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(signUpUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(signInUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signInUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(signInUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(signOutUser.fulfilled, (state) => {
        state.user = null;
      })

      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.error = action.payload;
      });
  },
});

export default authSlice.reducer;
