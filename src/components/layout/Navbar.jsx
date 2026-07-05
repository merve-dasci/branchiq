import React from 'react';
import { MapPin } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.jsx';

export default function Navbar({ activeTab, selectedRegion, setSelectedRegion, currentUser, isSimulating, setIsSimulating }) {
  const { language, setLanguage, t } = useLanguage();
  
  // Dynamic Title computation
  const getTabTitle = () => {
    switch (activeTab) {
      case 'overview':
        return t('overview');
      case 'branches':
        return t('branches');
      case 'menu':
        return t('menu');
      case 'orders':
        return t('orders');
      case 'staff':
        return t('staff');
      case 'announcements':
        return t('announcements');
      case 'inventory':
        return t('inventory');
      case 'reports':
        return t('reports');
      case 'settings':
        return t('settings');
      case 'branchDashboard':
        return t('branchDashboard');
      case 'reservations':
        return t('reservations');
      case 'tables':
        return t('tables');
      case 'kitchenQueue':
        return t('kitchenQueue');
      case 'liveOrders':
        return t('liveOrders');
      case 'tableStatus':
        return t('tableStatus');
      default:
        return 'BranchIQ Management Console';
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 h-16 px-8 flex items-center justify-between flex-shrink-0 z-30">
      
      {/* 1. View title context details */}
      <div className="flex items-center gap-3">
        <h2 id="view-header-title" className="text-sm sm:text-base font-black text-slate-900 tracking-tight">{getTabTitle()}</h2>
        <span className="hidden sm:inline-block h-4 w-px bg-slate-200"></span>
        <span className="hidden sm:inline-block text-[10px] text-slate-400 font-extrabold uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
          {t('secure_core')}
        </span>
      </div>

      {/* 2. Controls and active profile summary */}
      <div className="flex items-center gap-5">
        
        {/* Simulator Toggle Button */}
        {setIsSimulating && (
          <button
            id="simulation-toggle-btn"
            onClick={() => setIsSimulating(!isSimulating)}
            className={`flex items-center gap-1.5 border px-3 py-1.5 rounded-xl text-[9px] font-black uppercase transition-all cursor-pointer ${
              isSimulating 
                ? 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100' 
                : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isSimulating ? 'bg-rose-500 animate-ping' : 'bg-slate-400'}`} />
            <span>{isSimulating ? t('simulation_active') : t('simulation_paused')}</span>
          </button>
        )}
        
        {/* Language Toggle Selector */}
        <button
          id="lang-toggle-btn"
          onClick={() => setLanguage(language === 'tr' ? 'en' : 'tr')}
          className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 transition-all hover:bg-slate-100 hover:border-slate-350 cursor-pointer"
        >
          <span>🌐</span>
          <span className="uppercase text-[10px] font-black">{language === 'tr' ? 'Türkçe' : 'English'}</span>
        </button>

        {/* Region Scoping Filter (Visible on aggregate global views) */}
        {['overview', 'branches', 'orders', 'staff'].includes(activeTab) && (
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 transition-all hover:border-slate-300">
            <MapPin size={12} className="text-blue-500" />
            <span className="text-[10px] font-bold uppercase text-slate-400">{t('scope')}</span>
            <select
              id="global-region-scoper"
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="bg-transparent border-none font-bold text-slate-700 cursor-pointer focus:outline-hidden"
            >
              <option value="All">{t('all_regions')}</option>
              <option value="Marmara">{t('marmara')}</option>
              <option value="Central Anatolia">{t('central_anatolia')}</option>
              <option value="Aegean">{t('aegean')}</option>
            </select>
          </div>
        )}

        {/* User Card */}
        {currentUser && (
          <div id="navbar-user-card" className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs font-extrabold text-slate-800 leading-tight">{currentUser.name}</p>
              <p className="text-[9px] font-bold text-blue-650 uppercase tracking-wide leading-none mt-0.5">{currentUser.role}</p>
            </div>
            <div className="h-9 w-9 bg-slate-900 text-white rounded-xl flex items-center justify-center text-xs font-black shadow-inner">
              {currentUser.name.split(' ').map(n => n[0]).join('')}
            </div>
          </div>
        )}

      </div>

    </header>
  );
}
