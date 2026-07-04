import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '../../services/api.js';

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authApi.login(credentials);
      if (response.data.success) {
        localStorage.setItem('branchiq_user', JSON.stringify(response.data.user));
        return response.data.user;
      }
      return rejectWithValue('Login failed');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Login failed. Please check credentials.');
    }
  }
);

const getInitialUser = () => {
  try {
    const saved = localStorage.getItem('branchiq_user');
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: getInitialUser(),
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.error = null;
      localStorage.removeItem('branchiq_user');
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
