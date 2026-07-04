import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { inventoryApi } from '../../services/api.js';

export const fetchInventory = createAsyncThunk(
  'inventory/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await inventoryApi.getAll();
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch inventory');
    }
  }
);

export const addInventoryItem = createAsyncThunk(
  'inventory/add',
  async (itemData, { rejectWithValue }) => {
    try {
      const response = await inventoryApi.create(itemData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to add inventory item');
    }
  }
);

export const updateInventoryItem = createAsyncThunk(
  'inventory/update',
  async (itemData, { rejectWithValue }) => {
    try {
      const response = await inventoryApi.update(itemData.id, itemData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update inventory item');
    }
  }
);

export const deleteInventoryItem = createAsyncThunk(
  'inventory/delete',
  async (id, { rejectWithValue }) => {
    try {
      await inventoryApi.delete(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete inventory item');
    }
  }
);

const inventorySlice = createSlice({
  name: 'inventory',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchInventory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInventory.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchInventory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add
      .addCase(addInventoryItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addInventoryItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(addInventoryItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update
      .addCase(updateInventoryItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateInventoryItem.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateInventoryItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete
      .addCase(deleteInventoryItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteInventoryItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(item => item.id !== action.payload);
      })
      .addCase(deleteInventoryItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default inventorySlice.reducer;
