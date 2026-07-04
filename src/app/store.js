import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice.js';
import branchesReducer from '../features/branches/branchesSlice.js';
import employeesReducer from '../features/employees/employeesSlice.js';
import menuReducer from '../features/menu/menuSlice.js';
import inventoryReducer from '../features/inventory/inventorySlice.js';
import ordersReducer from '../features/orders/ordersSlice.js';
import reservationsReducer from '../features/reservations/reservationsSlice.js';
import tablesReducer from '../features/tables/tablesSlice.js';
import campaignsReducer from '../features/campaigns/campaignsSlice.js';
import reportsReducer from '../features/reports/reportsSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    branches: branchesReducer,
    employees: employeesReducer,
    menu: menuReducer,
    inventory: inventoryReducer,
    orders: ordersReducer,
    reservations: reservationsReducer,
    tables: tablesReducer,
    campaigns: campaignsReducer,
    reports: reportsReducer,
  },
});

export default store;
