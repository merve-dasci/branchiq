import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { employeesApi } from '../../services/api.js';

export const fetchEmployees = createAsyncThunk(
  'employees/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await employeesApi.getAll();
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch employees');
    }
  }
);

export const addEmployee = createAsyncThunk(
  'employees/add',
  async (employeeData, { rejectWithValue }) => {
    try {
      const response = await employeesApi.create(employeeData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to add employee');
    }
  }
);

export const updateEmployee = createAsyncThunk(
  'employees/update',
  async (employeeData, { rejectWithValue }) => {
    try {
      const response = await employeesApi.update(employeeData.id, employeeData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update employee');
    }
  }
);

export const deleteEmployee = createAsyncThunk(
  'employees/delete',
  async (id, { rejectWithValue }) => {
    try {
      await employeesApi.delete(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete employee');
    }
  }
);

// Backward compatibility exports for existing components
export const fetchStaff = fetchEmployees;
export const addStaff = addEmployee;
export const updateStaff = updateEmployee;
export const deleteStaff = deleteEmployee;

const employeesSlice = createSlice({
  name: 'employees',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add
      .addCase(addEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(addEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update
      .addCase(updateEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(e => e.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete
      .addCase(deleteEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(e => e.id !== action.payload);
      })
      .addCase(deleteEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default employeesSlice.reducer;
