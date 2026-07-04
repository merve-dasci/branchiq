import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { menuApi } from '../../services/api.js';

export const fetchMenuItems = createAsyncThunk(
  'menu/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await menuApi.getAll();
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch menu items');
    }
  }
);

export const addMenuItem = createAsyncThunk(
  'menu/add',
  async (itemData, { rejectWithValue }) => {
    try {
      const response = await menuApi.create(itemData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to add menu item');
    }
  }
);

export const updateMenuItem = createAsyncThunk(
  'menu/update',
  async (itemData, { rejectWithValue }) => {
    try {
      const response = await menuApi.update(itemData.id, itemData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update menu item');
    }
  }
);

export const deleteMenuItem = createAsyncThunk(
  'menu/delete',
  async (id, { rejectWithValue }) => {
    try {
      await menuApi.delete(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete menu item');
    }
  }
);

const menuSlice = createSlice({
  name: 'menu',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchMenuItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMenuItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchMenuItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add
      .addCase(addMenuItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addMenuItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(addMenuItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update
      .addCase(updateMenuItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMenuItem.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateMenuItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete
      .addCase(deleteMenuItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMenuItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(item => item.id !== action.payload);
      })
      .addCase(deleteMenuItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default menuSlice.reducer;
