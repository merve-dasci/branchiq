import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { reportsApi } from '../../services/api.js';

export const fetchReports = createAsyncThunk(
  'reports/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await reportsApi.getAll();
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch reports');
    }
  }
);

export const addReport = createAsyncThunk(
  'reports/add',
  async (reportData, { rejectWithValue }) => {
    try {
      const response = await reportsApi.create(reportData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to add report');
    }
  }
);

export const updateReport = createAsyncThunk(
  'reports/update',
  async (reportData, { rejectWithValue }) => {
    try {
      const response = await reportsApi.update(reportData.id, reportData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update report');
    }
  }
);

export const deleteReport = createAsyncThunk(
  'reports/delete',
  async (id, { rejectWithValue }) => {
    try {
      await reportsApi.delete(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete report');
    }
  }
);

const reportsSlice = createSlice({
  name: 'reports',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add
      .addCase(addReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addReport.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(addReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update
      .addCase(updateReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateReport.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete
      .addCase(deleteReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteReport.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(item => item.id !== action.payload);
      })
      .addCase(deleteReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default reportsSlice.reducer;
