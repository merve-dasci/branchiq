import { createSlice } from '@reduxjs/toolkit';

const reduxLogsSlice = createSlice({
  name: 'reduxLogs',
  initialState: {
    items: [],
  },
  reducers: {
    addLog: (state, action) => {
      state.items.unshift(action.payload);
      if (state.items.length > 50) {
        state.items.pop(); // Keep last 50 events
      }
    },
    clearLogs: (state) => {
      state.items = [];
    }
  }
});

export const { addLog, clearLogs } = reduxLogsSlice.actions;
export default reduxLogsSlice.reducer;
