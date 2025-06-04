import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../supabaseClient";


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

//     if (error) {
//       // Показываем общую понятную ошибку, если ошибка от supabase выглядит "технически"
//       const friendlyMessage = error.message.toLowerCase().includes('invalid') ||
//                               error.message.toLowerCase().includes('character') ||
//                               error.message.toLowerCase().includes('format')
//         ? 'Произошла ошибка! Попробуйте ещё раз.'
//         : error.message;

//       return thunkAPI.rejectWithValue(friendlyMessage);
//     }

//     const user = data.user;

//     const { error: userError } = await supabase
//       .from('users')
//       .insert([{ id: user.id, email, nickname }]);

//     if (userError) {
//       return thunkAPI.rejectWithValue('Произошла ошибка при создании пользователя. Попробуйте ещё раз.');
//     }

//     return {
//       id: user.id,
//       email: user.email,
//       nickname: user.user_metadata?.nickname || '',
//     };
//   }
  
// );

export const signUpUser = createAsyncThunk(
  'auth/signUpUser',
  async ({ email, password, nickname }, thunkAPI) => {
    const { dispatch } = thunkAPI;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nickname },
      },
    });

    if (error) {
      const friendlyMessage = error.message.toLowerCase().includes('invalid') ||
                              error.message.toLowerCase().includes('character') ||
                              error.message.toLowerCase().includes('format')
        ? 'Произошла ошибка! Попробуйте ещё раз.'
        : error.message;

      return thunkAPI.rejectWithValue(friendlyMessage);
    }

    const user = data.user;

    const { error: userError } = await supabase
      .from('users')
      .insert([{ id: user.id, email, nickname }]);

    if (userError) {
      return thunkAPI.rejectWithValue('Произошла ошибка при создании пользователя. Попробуйте ещё раз.');
    }

    await dispatch(signInUser({ email, password }));

    return {
      id: user.id,
      email: user.email,
      nickname: nickname,
    };
  }
);

export const deleteAccount = createAsyncThunk(
  "auth/deleteAccount",
  async (userId, thunkAPI) => {
    // Удаляем все привычки пользователя
    await supabase.from("habits").delete().eq("user_id", userId);

    // Удаляем пользователя из таблицы users
    await supabase.from("users").delete().eq("id", userId);

    // Выходим из аккаунта
    await supabase.auth.signOut();

    // Очищаем пользователя в Redux
    return userId;
  }
);



export const signInUser = createAsyncThunk(
  "auth/signInUser",
  async ({ email, password }, thunkAPI) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Преобразуем техническое сообщение в понятное
      const errorMessage =
        error.message === "Invalid login credentials"
          ? "Неверный пароль или email"
          : error.message;
      return thunkAPI.rejectWithValue(errorMessage);
    }

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

export const createDemoUser = createAsyncThunk(
  'auth/createDemoUser',
  async (_, thunkAPI) => {
    const generateRandomString = (length = 10) =>
      Math.random().toString(36).slice(2, 2 + length);

    const email = `demo_${Date.now()}@demo.app`;
    const password = generateRandomString(12);
    const nickname = `User${Math.floor(Math.random() * 10000)}`;
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // +24 часа

    // 1. Регистрируем пользователя
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nickname },
      },
    });

    if (error || !data?.user) {
      return thunkAPI.rejectWithValue(
        error?.message || 'Не удалось создать демо-пользователя'
      );
    }

    const user = data.user;

    // 2. Добавляем в таблицу `users`
    const { error: insertError } = await supabase.from('users').insert([
      {
        id: user.id,
        email,
        nickname,
        is_demo: true,
        expires_at: expiresAt,
      },
    ]);

    if (insertError) {
      return thunkAPI.rejectWithValue(
        'Ошибка при создании профиля демо-пользователя'
      );
    }

    // 3. Сразу входим под ним
    const { data: signInData, error: signInError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (signInError || !signInData?.user) {
      return thunkAPI.rejectWithValue(
        signInError?.message || 'Не удалось войти в демо-режим'
      );
    }

    return {
      id: signInData.user.id,
      email,
      nickname,
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
        state.error = action.payload || "Произошла ошибка входа";
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

      .addCase(createDemoUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDemoUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(createDemoUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteAccount.fulfilled, (state) => {
        state.user = null;
        state.status = "idle";
      })
  },
});

export default authSlice.reducer;
