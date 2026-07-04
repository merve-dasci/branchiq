import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Routes, Route, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { fetchBranches } from './features/branches/branchesSlice.js';
import { fetchMenuItems } from './features/menu/menuSlice.js';
import { fetchOrders } from './features/orders/ordersSlice.js';
import { fetchStaff } from './features/employees/employeesSlice.js';
import { fetchAnnouncements } from './features/campaigns/campaignsSlice.js';
import { logout } from './features/auth/authSlice.js';

// Layout
import Sidebar from './components/layout/Sidebar.jsx';
import Navbar from './components/layout/Navbar.jsx';

// Auth page
import Login from './pages/auth/Login.jsx';

// Super Admin pages
import SuperAdminDashboard from './pages/superAdmin/SuperAdminDashboard.jsx';
import Branches from './pages/superAdmin/Branches.jsx';
import BranchDetail from './pages/superAdmin/BranchDetail.jsx';
import Employees from './pages/superAdmin/Employees.jsx';
import MenuManagement from './pages/superAdmin/MenuManagement.jsx';
import InventoryManagement from './pages/superAdmin/InventoryManagement.jsx';
import Reports from './pages/superAdmin/Reports.jsx';
import Campaigns from './pages/superAdmin/Campaigns.jsx';
import Settings from './pages/superAdmin/Settings.jsx';

// Branch Admin pages
import BranchDashboard from './pages/branchAdmin/BranchDashboard.jsx';
import Orders from './pages/branchAdmin/Orders.jsx';
import Reservations from './pages/branchAdmin/Reservations.jsx';
import TableManagement from './pages/branchAdmin/TableManagement.jsx';

// Operation pages
import KitchenQueue from './pages/operation/KitchenQueue.jsx';
import LiveOrders from './pages/operation/LiveOrders.jsx';
import TableStatus from './pages/operation/TableStatus.jsx';

import { Loader2 } from 'lucide-react';

export default function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.user);

  // Core Data State
  const branches = useSelector((state) => state.branches);
  const menu = useSelector((state) => state.menu);
  const orders = useSelector((state) => state.orders);
  const staff = useSelector((state) => state.employees);
  const announcements = useSelector((state) => ({
    items: state.campaigns.announcements,
    loading: state.campaigns.loading,
    error: state.campaigns.error
  }));

  // UI State
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedDetailedBranch, setSelectedDetailedBranch] = useState(null);

  // Trigger initial server fetches on mount (or when a user logs in successfully)
  useEffect(() => {
    if (currentUser) {
      dispatch(fetchBranches());
      dispatch(fetchMenuItems());
      dispatch(fetchOrders());
      dispatch(fetchStaff());
      dispatch(fetchAnnouncements());
    }
  }, [currentUser, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    setSelectedRegion('All');
    setSelectedDetailedBranch(null);
    navigate('/login');
  };

  // Calculate master loading states
  const isDataLoading = branches.loading || menu.loading || orders.loading || staff.loading || announcements.loading;

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      {/* Super Admin Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={['superAdmin', 'Super Admin']} />}>
        <Route element={<AppLayout 
          currentUser={currentUser}
          handleLogout={handleLogout}
          selectedRegion={selectedRegion}
          setSelectedRegion={setSelectedRegion}
          isDataLoading={isDataLoading}
        />}>
          <Route path="/super-admin/dashboard" element={
            <SuperAdminDashboard 
              branches={branches.items}
              menuItems={menu.items}
              orders={orders.items}
              staff={staff.items}
              announcements={announcements.items}
              selectedRegion={selectedRegion}
              setActiveTab={(tab) => {
                if (tab === 'branches') navigate('/super-admin/branches');
                else if (tab === 'staff') navigate('/super-admin/staff');
                else if (tab === 'menu') navigate('/super-admin/menu');
                else if (tab === 'inventory') navigate('/super-admin/inventory');
                else if (tab === 'reports') navigate('/super-admin/reports');
                else if (tab === 'announcements') navigate('/super-admin/announcements');
                else if (tab === 'settings') navigate('/super-admin/settings');
              }}
            />
          } />
          <Route path="/super-admin/branches" element={
            selectedDetailedBranch ? (
              <BranchDetail 
                branch={selectedDetailedBranch}
                staff={staff.items}
                orders={orders.items}
                onBack={() => setSelectedDetailedBranch(null)}
              />
            ) : (
              <Branches 
                branches={branches.items} 
                selectedRegion={selectedRegion}
                currentUser={currentUser}
                onViewDetail={(branch) => setSelectedDetailedBranch(branch)}
              />
            )
          } />
          <Route path="/super-admin/staff" element={
            <Employees 
              staff={staff.items} 
              branches={branches.items} 
              selectedRegion={selectedRegion}
              currentUser={currentUser}
            />
          } />
          <Route path="/super-admin/menu" element={
            <MenuManagement 
              menuItems={menu.items} 
              currentUser={currentUser}
            />
          } />
          <Route path="/super-admin/inventory" element={
            <InventoryManagement 
              currentUser={currentUser}
            />
          } />
          <Route path="/super-admin/reports" element={
            <Reports 
              branches={branches.items}
              menuItems={menu.items}
              orders={orders.items}
            />
          } />
          <Route path="/super-admin/announcements" element={
            <Campaigns 
              announcements={announcements.items} 
              currentUser={currentUser}
            />
          } />
          <Route path="/super-admin/settings" element={
            <Settings 
              currentUser={currentUser}
            />
          } />
        </Route>
      </Route>

      {/* Branch Admin Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={['branchAdmin']} />}>
        <Route element={<AppLayout 
          currentUser={currentUser}
          handleLogout={handleLogout}
          selectedRegion={selectedRegion}
          setSelectedRegion={setSelectedRegion}
          isDataLoading={isDataLoading}
        />}>
          <Route path="/branch-admin/dashboard" element={
            <BranchDashboard 
              currentUser={currentUser}
              orders={orders.items}
              branches={branches.items}
            />
          } />
          <Route path="/branch-admin/orders" element={
            <Orders 
              orders={orders.items} 
              branches={branches.items} 
              menuItems={menu.items} 
              selectedRegion={selectedRegion}
              currentUser={currentUser}
            />
          } />
          <Route path="/branch-admin/reservations" element={
            <Reservations 
              currentUser={currentUser}
            />
          } />
          <Route path="/branch-admin/tables" element={
            <TableManagement 
              currentUser={currentUser}
            />
          } />
          <Route path="/branch-admin/announcements" element={
            <Campaigns 
              announcements={announcements.items} 
              currentUser={currentUser}
            />
          } />
        </Route>
      </Route>

      {/* Operation Admin Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={['operationAdmin']} />}>
        <Route element={<AppLayout 
          currentUser={currentUser}
          handleLogout={handleLogout}
          selectedRegion={selectedRegion}
          setSelectedRegion={setSelectedRegion}
          isDataLoading={isDataLoading}
        />}>
          <Route path="/operation/kitchen" element={
            <KitchenQueue 
              currentUser={currentUser}
            />
          } />
          <Route path="/operation/live-orders" element={
            <LiveOrders 
              currentUser={currentUser}
            />
          } />
          <Route path="/operation/tables" element={
            <TableStatus 
              currentUser={currentUser}
            />
          } />
        </Route>
      </Route>

      {/* Root/Fallback Redirections */}
      <Route path="/" element={<NavigateToDashboard />} />
      <Route path="*" element={<NavigateToDashboard />} />
    </Routes>
  );
}

// ProtectedRoute checks user role correctly
function ProtectedRoute({ allowedRoles }) {
  const currentUser = useSelector((state) => state.auth.user);
  const location = useLocation();
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    // Redirect logged-in users attempting unauthorized access to their starting route
    if (currentUser.role === 'superAdmin' || currentUser.role === 'Super Admin') {
      return <Navigate to="/super-admin/dashboard" replace />;
    } else if (currentUser.role === 'branchAdmin') {
      return <Navigate to="/branch-admin/dashboard" replace />;
    } else if (currentUser.role === 'operationAdmin') {
      return <Navigate to="/operation/kitchen" replace />;
    }
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}

// AppLayout encapsulates Sidebar, Navbar, dynamic layouts and loaders
function AppLayout({ currentUser, handleLogout, selectedRegion, setSelectedRegion, isDataLoading }) {
  const location = useLocation();
  
  // Map pathname to activeTab to keep Sidebar and Navbar highlights working seamlessly
  const getActiveTabFromPathname = (pathname) => {
    if (pathname.includes('/super-admin/dashboard')) return 'overview';
    if (pathname.includes('/super-admin/branches')) return 'branches';
    if (pathname.includes('/super-admin/staff')) return 'staff';
    if (pathname.includes('/super-admin/menu')) return 'menu';
    if (pathname.includes('/super-admin/inventory')) return 'inventory';
    if (pathname.includes('/super-admin/reports')) return 'reports';
    if (pathname.includes('/super-admin/announcements')) return 'announcements';
    if (pathname.includes('/super-admin/settings')) return 'settings';
    
    if (pathname.includes('/branch-admin/dashboard')) return 'branchDashboard';
    if (pathname.includes('/branch-admin/orders')) return 'orders';
    if (pathname.includes('/branch-admin/reservations')) return 'reservations';
    if (pathname.includes('/branch-admin/tables')) return 'tables';
    if (pathname.includes('/branch-admin/announcements')) return 'announcements';
    
    if (pathname.includes('/operation/kitchen')) return 'kitchenQueue';
    if (pathname.includes('/operation/live-orders')) return 'liveOrders';
    if (pathname.includes('/operation/tables')) return 'tables';
    
    return 'overview';
  };

  const activeTab = getActiveTabFromPathname(location.pathname);

  return (
    <div id="branchiq-app-root" className="min-h-screen bg-slate-100 flex flex-row overflow-hidden font-sans antialiased text-slate-800">
      
      {/* 1. Left Persistent Sidebar Drawer */}
      <Sidebar 
        activeTab={activeTab} 
        currentUser={currentUser} 
        onLogout={handleLogout} 
      />

      {/* 2. Main Workstage Block */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* Top Floating Glassmorphic Header */}
        <Navbar 
          activeTab={activeTab} 
          selectedRegion={selectedRegion} 
          setSelectedRegion={setSelectedRegion} 
          currentUser={currentUser} 
        />

        {/* 3. Render Area Panels with Global Loader Guard */}
        <main className="flex-1 overflow-y-auto bg-slate-50 relative">
          {isDataLoading && (
            <div className="absolute inset-0 bg-slate-50/50 backdrop-blur-xs flex items-center justify-center z-40 animate-fade-in">
              <div className="bg-white/80 p-5 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-200">
                <Loader2 className="animate-spin text-blue-600" size={18} />
                <span className="text-xs font-bold text-slate-700 font-sans">Syncing with BranchIQ Cloud...</span>
              </div>
            </div>
          )}
          <Outlet />
        </main>
      </div>

    </div>
  );
}

function NavigateToDashboard() {
  const currentUser = useSelector((state) => state.auth.user);
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  if (currentUser.role === 'superAdmin' || currentUser.role === 'Super Admin') {
    return <Navigate to="/super-admin/dashboard" replace />;
  } else if (currentUser.role === 'branchAdmin') {
    return <Navigate to="/branch-admin/dashboard" replace />;
  } else if (currentUser.role === 'operationAdmin') {
    return <Navigate to="/operation/kitchen" replace />;
  }
  return <Navigate to="/login" replace />;
}
