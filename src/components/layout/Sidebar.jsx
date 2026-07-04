import React from 'react';
import { 
  LayoutDashboard, 
  Store, 
  UtensilsCrossed, 
  ClipboardList, 
  Users, 
  Megaphone, 
  LogOut,
  ChevronRight,
  Boxes,
  BarChart3,
  Settings,
  Calendar,
  Layers,
  ChefHat,
  Activity
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext.jsx';

export default function Sidebar({ activeTab, setActiveTab, currentUser, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  
  // Role-based tab definitions with route paths
  const getTabsForRole = () => {
    const role = currentUser?.role;
    if (role === 'superAdmin' || role === 'Super Admin') {
      return [
        { id: 'overview', label: t('overview'), icon: LayoutDashboard, path: '/super-admin/dashboard' },
        { id: 'branches', label: t('branches'), icon: Store, path: '/super-admin/branches' },
        { id: 'staff', label: t('staff'), icon: Users, path: '/super-admin/staff' },
        { id: 'menu', label: t('menu'), icon: UtensilsCrossed, path: '/super-admin/menu' },
        { id: 'inventory', label: t('inventory'), icon: Boxes, path: '/super-admin/inventory' },
        { id: 'reports', label: t('reports'), icon: BarChart3, path: '/super-admin/reports' },
        { id: 'announcements', label: t('announcements'), icon: Megaphone, path: '/super-admin/announcements' },
        { id: 'settings', label: t('settings'), icon: Settings, path: '/super-admin/settings' }
      ];
    } else if (role === 'branchAdmin') {
      return [
        { id: 'branchDashboard', label: t('branchDashboard'), icon: LayoutDashboard, path: '/branch-admin/dashboard' },
        { id: 'orders', label: t('orders'), icon: ClipboardList, path: '/branch-admin/orders' },
        { id: 'reservations', label: t('reservations'), icon: Calendar, path: '/branch-admin/reservations' },
        { id: 'tables', label: t('tables'), icon: Layers, path: '/branch-admin/tables' },
        { id: 'announcements', label: t('announcements'), icon: Megaphone, path: '/branch-admin/announcements' }
      ];
    } else if (role === 'operationAdmin') {
      return [
        { id: 'kitchenQueue', label: t('kitchenQueue'), icon: ChefHat, path: '/operation/kitchen' },
        { id: 'liveOrders', label: t('liveOrders'), icon: Activity, path: '/operation/live-orders' },
        { id: 'tables', label: t('tables'), icon: Layers, path: '/operation/tables' }
      ];
    } else {
      return [];
    }
  };

  const tabs = getTabsForRole();

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen flex-shrink-0 text-white select-none z-35">
      
      {/* Brand Title block */}
      <div className="h-16 px-6 flex items-center gap-3 border-b border-slate-800">
        <div className="p-2 bg-blue-600 rounded-xl text-white shadow-md shadow-blue-500/10">
          <UtensilsCrossed size={16} />
        </div>
        <div>
          <h1 className="font-black text-sm tracking-tight text-white leading-none">BranchIQ</h1>
          <p className="text-[9px] font-bold text-slate-500 tracking-wider uppercase leading-none mt-1">{t('enterprise_console')}</p>
        </div>
      </div>

      {/* Navigation Tab Links list */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = location.pathname === tab.path;

          return (
            <button
              key={tab.id}
              id={`sidebar-tab-${tab.id}`}
              onClick={() => {
                navigate(tab.path);
                if (setActiveTab) {
                  setActiveTab(tab.id);
                }
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/10' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon size={14} className={isActive ? 'text-white' : 'text-slate-400'} />
                <span>{tab.label}</span>
              </div>
              {isActive && <ChevronRight size={12} className="text-white/60" />}
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer block */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40 space-y-4">
        
        {/* Developed by Tagline branding metadata */}
        <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/40 text-[9px] text-slate-500 font-bold space-y-1">
          <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">SMAH Technologies</p>
          <p className="text-slate-500 font-medium">{t('developed_by')}</p>
        </div>

        {/* Authenticated Logout trigger */}
        <button
          id="logout-btn"
          onClick={onLogout}
          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-rose-400 hover:bg-rose-500/5 transition-all cursor-pointer"
        >
          <LogOut size={14} />
          <span>{t('exit_system')}</span>
        </button>

      </div>

    </aside>
  );
}
