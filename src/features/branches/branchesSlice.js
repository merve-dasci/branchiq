import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { branchesApi } from '../../services/api.js';

export const fetchBranches = createAsyncThunk(
  'branches/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await branchesApi.getAll();
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch branches');
    }
  }
);

export const addBranch = createAsyncThunk(
  'branches/add',
  async (branchData, { rejectWithValue }) => {
    try {
      const response = await branchesApi.create(branchData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to add branch');
    }
  }
);

export const updateBranch = createAsyncThunk(
  'branches/update',
  async (branchData, { rejectWithValue }) => {
    try {
      const response = await branchesApi.update(branchData.id, branchData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update branch');
    }
  }
);

export const deleteBranch = createAsyncThunk(
  'branches/delete',
  async (id, { rejectWithValue }) => {
    try {
      await branchesApi.delete(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete branch');
    }
  }
);

const branchesSlice = createSlice({
  name: 'branches',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchBranches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBranches.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchBranches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add
      .addCase(addBranch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addBranch.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(addBranch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update
      .addCase(updateBranch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBranch.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(b => b.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateBranch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete
      .addCase(deleteBranch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBranch.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(b => b.id !== action.payload);
      })
      .addCase(deleteBranch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default branchesSlice.reducer;
