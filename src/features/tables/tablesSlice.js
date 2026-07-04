import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { tablesApi } from '../../services/api.js';

export const fetchTables = createAsyncThunk(
  'tables/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await tablesApi.getAll();
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch tables');
    }
  }
);

export const addTable = createAsyncThunk(
  'tables/add',
  async (tableData, { rejectWithValue }) => {
    try {
      const response = await tablesApi.create(tableData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to add table');
    }
  }
);

export const updateTable = createAsyncThunk(
  'tables/update',
  async (tableData, { rejectWithValue }) => {
    try {
      const response = await tablesApi.update(tableData.id, tableData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update table');
    }
  }
);

export const deleteTable = createAsyncThunk(
  'tables/delete',
  async (id, { rejectWithValue }) => {
    try {
      await tablesApi.delete(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete table');
    }
  }
);

const tablesSlice = createSlice({
  name: 'tables',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchTables.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTables.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTables.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add
      .addCase(addTable.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTable.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(addTable.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update
      .addCase(updateTable.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTable.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateTable.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete
      .addCase(deleteTable.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTable.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(item => item.id !== action.payload);
      })
      .addCase(deleteTable.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default tablesSlice.reducer;
