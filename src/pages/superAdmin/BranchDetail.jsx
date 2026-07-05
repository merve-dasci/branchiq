import React, { useState } from 'react';
import { 
  Store, 
  MapPin, 
  Users, 
  DollarSign, 
  Award, 
  Phone, 
  TrendingUp, 
  Layers, 
  ChevronLeft 
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.jsx';

export default function BranchDetail({ branch, staff, orders, onBack }) {
  const { t } = useLanguage();
  const [toastVisible, setToastVisible] = useState(false);

  const handleExport = () => {
    setToastVisible(true);
    setTimeout(() => {
      setToastVisible(false);
    }, 2500);
  };

  if (!branch) {
    return (
      <div className="p-8 text-center bg-white border border-slate-200 rounded-2xl m-8">
        <p className="text-slate-500 font-bold">{t('select_branch_analytics')}</p>
        {onBack && (
          <button 
            onClick={onBack}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold"
          >
            {t('go_back')}
          </button>
        )}
      </div>
    );
  }

  // Calculate branch-specific metrics
  const branchStaff = staff.filter(s => s.branchId === branch.id);
  const branchOrders = orders.filter(o => o.branchId === branch.id);
  const totalOrdersVal = branchOrders.reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div id="branch-detail-panel" className="p-8 space-y-6 relative overflow-hidden animate-fade-in">
      
      {/* Toast Notification Widget */}
      {toastVisible && (
        <div className="fixed top-6 right-6 bg-slate-900 border border-slate-800 text-white rounded-2xl p-4 shadow-2xl flex items-center gap-3 z-50 animate-slide-in">
          <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
            <TrendingUp size={16} className="animate-pulse" />
          </div>
          <div>
            <p className="text-xs font-black tracking-tight text-white">{t('export_report')}</p>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{t('export_success')}</p>
          </div>
        </div>
      )}

      {/* Back button and header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onBack && (
            <button 
              onClick={onBack}
              className="p-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl cursor-pointer"
              title={t('back_to_branches')}
            >
              <ChevronLeft size={16} />
            </button>
          )}
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">{branch.name} {t('analytics_title')}</h2>
            <p className="text-xs text-slate-500 font-semibold">{branch.city} {t('city_node')} • {branch.region} {t('region_label')}</p>
          </div>
        </div>

        <button
          onClick={handleExport}
          className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md cursor-pointer transition-all border border-slate-800"
        >
          <TrendingUp size={14} />
          <span>{t('export_report')}</span>
        </button>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 border border-slate-200 rounded-2xl shadow-xs">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{t('monthly_revenue')}</p>
              <h3 className="text-lg font-black text-slate-900 mt-1">${branch.revenueThisMonth?.toLocaleString()}</h3>
            </div>
            <div className="p-2.5 bg-blue-55 text-blue-600 rounded-xl">
              <DollarSign size={16} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 border border-slate-200 rounded-2xl shadow-xs">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{t('total_orders_simulated')}</p>
              <h3 className="text-lg font-black text-slate-900 mt-1">{branchOrders.length}</h3>
            </div>
            <div className="p-2.5 bg-emerald-55 text-emerald-600 rounded-xl">
              <TrendingUp size={16} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 border border-slate-200 rounded-2xl shadow-xs">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{t('staff_count')}</p>
              <h3 className="text-lg font-black text-slate-900 mt-1">{branchStaff.length}</h3>
            </div>
            <div className="p-2.5 bg-violet-55 text-violet-600 rounded-xl">
              <Users size={16} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 border border-slate-200 rounded-2xl shadow-xs">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{t('tables_configured')}</p>
              <h3 className="text-lg font-black text-slate-900 mt-1">{branch.tableCount}</h3>
            </div>
            <div className="p-2.5 bg-amber-55 text-amber-600 rounded-xl">
              <Layers size={16} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Info Column */}
        <div className="bg-white p-6 border border-slate-200 rounded-2xl shadow-xs space-y-6">
          <h4 className="font-extrabold text-slate-800 text-sm tracking-tight border-b border-slate-100 pb-3">{t('node_demographics')}</h4>
          
          <div className="space-y-4 text-xs">
            <div className="flex gap-3">
              <MapPin className="text-slate-400" size={16} />
              <div>
                <p className="font-bold text-slate-400">{t('address_location')}</p>
                <p className="font-semibold text-slate-800 mt-0.5">{branch.address}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Users className="text-slate-400" size={16} />
              <div>
                <p className="font-bold text-slate-400">{t('store_manager')}</p>
                <p className="font-semibold text-slate-800 mt-0.5">{branch.manager}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Phone className="text-slate-400" size={16} />
              <div>
                <p className="font-bold text-slate-400">{t('branch_telephone')}</p>
                <p className="font-semibold text-slate-800 mt-0.5">{branch.phone || t('no_phone_set')}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Award className="text-slate-400" size={16} />
              <div>
                <p className="font-bold text-slate-400">{t('performance_rating')}</p>
                <p className="font-semibold text-slate-800 mt-0.5">{branch.rating || 0} / 5.0 {t('stars')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Staff Column */}
        <div className="lg:col-span-2 bg-white p-6 border border-slate-200 rounded-2xl shadow-xs space-y-4">
          <h4 className="font-extrabold text-slate-800 text-sm tracking-tight border-b border-slate-100 pb-3">{t('assigned_staff_directory')}</h4>
          {branchStaff.length > 0 ? (
            <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
              {branchStaff.map(member => (
                <div key={member.id} className="py-3 flex items-center justify-between text-xs font-semibold text-slate-700">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 bg-slate-100 text-slate-600 rounded-lg flex items-center justify-center font-bold text-xs">
                      {member.name[0]}
                    </div>
                    <div>
                      <p className="text-slate-900 font-bold">{member.name}</p>
                      <p className="text-[10px] text-slate-400 font-medium">{t(member.role.toLowerCase()) || member.role}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded-md ${
                    member.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {member.status === 'Active' ? t('active') : t('inactive')}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 py-8 text-center">{t('no_employees_assigned')}</p>
          )}
        </div>
      </div>
    </div>
  );
}
