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



export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, thunkAPI) => {
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData.user) {
      return thunkAPI.rejectWithValue(authError?.message || 'No user');
    }

    const userId = authData.user.id;
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) return thunkAPI.rejectWithValue(error.message);

    return {
      id: data.id,
      email: data.email,
      nickname: data.nickname,
      avatar_url: data.avatar_url,
    };
  }
);


export const updateAvatar = createAsyncThunk(
  'auth/updateAvatar',
  async ({ avatarUrl, userId }, { rejectWithValue }) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ avatar_url: avatarUrl })
        .eq('id', userId);

      if (error) {
        throw error;
      }

      return avatarUrl; // вернём для обновления в state
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


export const deleteAvatar = createAsyncThunk(
  'auth/deleteAvatar',
  async (userId, { rejectWithValue }) => {
    try {
      const DEFAULT_AVATAR_URL = 'https://i.ibb.co/3y45FgtQ/img.png'; // или внешний URL

      const { error } = await supabase
        .from('users')
        .update({ avatar_url: DEFAULT_AVATAR_URL })
        .eq('id', userId);

      if (error) throw error;

      return DEFAULT_AVATAR_URL;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


export const updateNickname = createAsyncThunk(
  'auth/updateNickname',
  async ({ userId, newNickname }, { rejectWithValue }) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ nickname: newNickname })
        .eq('id', userId);

      if (error) throw error;

      return newNickname;
    } catch (error) {
      return rejectWithValue(error.message);
    }
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
      })

      .addCase(updateAvatar.fulfilled, (state, action) => {
        state.user.avatar_url = action.payload;
      })
      .addCase(deleteAvatar.fulfilled, (state, action) => {
        if (state.user) {
          state.user.avatar_url = action.payload;
        }
      })

      .addCase(updateNickname.fulfilled, (state, action) => {
        if (state.user) {
          state.user.nickname = action.payload;
        }
      })
  },
});

export default authSlice.reducer;
