import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { reservationsApi } from '../../services/api.js';

export const fetchReservations = createAsyncThunk(
  'reservations/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await reservationsApi.getAll();
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch reservations');
    }
  }
);

export const addReservation = createAsyncThunk(
  'reservations/add',
  async (resData, { rejectWithValue }) => {
    try {
      const response = await reservationsApi.create(resData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to add reservation');
    }
  }
);

export const updateReservation = createAsyncThunk(
  'reservations/update',
  async (resData, { rejectWithValue }) => {
    try {
      const response = await reservationsApi.update(resData.id, resData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update reservation');
    }
  }
);

export const deleteReservation = createAsyncThunk(
  'reservations/delete',
  async (id, { rejectWithValue }) => {
    try {
      await reservationsApi.delete(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete reservation');
    }
  }
);

const reservationsSlice = createSlice({
  name: 'reservations',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchReservations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReservations.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchReservations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add
      .addCase(addReservation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addReservation.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(addReservation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update
      .addCase(updateReservation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateReservation.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateReservation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete
      .addCase(deleteReservation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteReservation.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(item => item.id !== action.payload);
      })
      .addCase(deleteReservation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default reservationsSlice.reducer;
