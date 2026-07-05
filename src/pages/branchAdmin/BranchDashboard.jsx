// React kütüphanesini içe aktar
import React from 'react';
// Panel simgelerini Lucide React paketinden yükle
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  UtensilsCrossed, 
  Layers, 
  ClipboardCheck, 
  Clock 
} from 'lucide-react';
// Çoklu dil kancasını içe aktar
import { useLanguage } from '../../context/LanguageContext.jsx';

// Şube Yöneticisi Paneli (Branch Dashboard) Bileşeni
export default function BranchDashboard({ currentUser, orders, branches }) {
  const { t, language } = useLanguage();

  // Giriş yapmış şube yöneticisinin şube detaylarını bul
  const myBranch = branches.find(b => b.id === currentUser?.branchId) || branches[0];
  
  if (!myBranch) {
    return (
      <div className="p-8 text-center bg-white border border-slate-200 rounded-2xl m-8">
        <p className="text-slate-550 font-bold">{t('loading') || 'Loading local branch metrics...'}</p>
      </div>
    );
  }

  // Şubeye özel sipariş verilerini filtrele
  const localOrders = orders.filter(o => o.branchId === myBranch.id);
  const preparingOrdersCount = localOrders.filter(o => o.status === 'Preparing').length;
  const completedOrdersCount = localOrders.filter(o => o.status === 'Completed').length;
  const localRevenue = localOrders.reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div id="branch-admin-dashboard" className="p-8 space-y-6 animate-fade-in">
      
      {/* Şube Karşılama/Selamlama Başlığı (Greetings Block) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 text-white p-6 rounded-2xl">
        <div>
          <span className="bg-blue-600 text-[10px] uppercase font-black tracking-widest px-2.5 py-1 rounded-md">{t('local_branch_panel')}</span>
          <h2 className="text-xl font-black mt-2 tracking-tight">{t('welcome')}, {currentUser?.name || t('manager')}</h2>
          <p className="text-xs text-slate-400 font-medium mt-1">{t('operational_command_for_node')} <strong className="text-white">{myBranch.name}</strong></p>
        </div>
        <div className="text-right text-xs">
          <p className="font-bold text-slate-400">{t('target_region_scope')}</p>
          <p className="text-sm font-black text-blue-400 mt-0.5">{language === 'tr' ? myBranch.region.replace('Network', 'Ağı').replace('Secure Core', 'Güvenli Çekirdek') : myBranch.region} {t('sector') || 'Sector'}</p>
        </div>
      </div>

      {/* Şube İstatistik Kartları Grid Yapısı */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Yerel Şube Cirosu */}
        <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-2xs">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('local_revenue')}</p>
              <h3 className="text-xl font-black text-slate-900 mt-1">${localRevenue || myBranch.revenueThisMonth?.toLocaleString()}</h3>
              <p className="text-[9px] text-emerald-655 font-bold mt-1">{t('calculated_from_ledger')}</p>
            </div>
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <DollarSign size={16} />
            </div>
          </div>
        </div>

        {/* Toplam Sipariş Sayısı */}
        <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-2xs">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('total_orders')}</p>
              <h3 className="text-xl font-black text-slate-900 mt-1">{localOrders.length || myBranch.dailyOrders}</h3>
              <p className="text-[9px] text-slate-400 font-semibold mt-1">{t('includes_off_premise_tickets')}</p>
            </div>
            <div className="p-2.5 bg-violet-50 text-violet-600 rounded-xl">
              <ClipboardCheck size={16} />
            </div>
          </div>
        </div>

        {/* Hazırlanan Aktif Siparişler */}
        <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-2xs">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('active_preparing')}</p>
              <h3 className="text-xl font-black text-amber-600 mt-1">{preparingOrdersCount}</h3>
              <p className="text-[9px] text-amber-600 font-bold mt-1">{t('pending_kitchen_pickup')}</p>
            </div>
            <div className="p-2.5 bg-amber-50 text-amber-500 rounded-xl animate-pulse">
              <Clock size={16} />
            </div>
          </div>
        </div>

        {/* Toplam Masa Sayısı */}
        <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-2xs">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('total_tables')}</p>
              <h3 className="text-xl font-black text-slate-900 mt-1">{myBranch.tableCount || 24}</h3>
              <p className="text-[9px] text-slate-400 font-semibold mt-1">{t('interactive_layout')}</p>
            </div>
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <Layers size={16} />
            </div>
          </div>
        </div>

      </div>

      {/* Alt Rapor Grid Bölümü */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sol Kolon: Son Siparişler Tablosu */}
        <div className="lg:col-span-2 bg-white p-6 border border-slate-200 rounded-2xl space-y-4 shadow-2xs">
          <h4 className="font-extrabold text-slate-800 text-sm tracking-tight border-b border-slate-100 pb-3">{t('recent_station_tickets')}</h4>
          
          {localOrders.length > 0 ? (
            <div className="space-y-3.5 max-h-80 overflow-y-auto pr-1">
              {localOrders.slice().reverse().map(order => (
                <div key={order.id} className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs font-semibold">
                  <div className="space-y-1">
                    <p className="text-slate-900 font-bold">{order.id} ({order.type === 'Dine-In' ? (language === 'tr' ? 'Masaya Servis' : 'Dine-In') : (language === 'tr' ? 'Paket / Gel-Al' : order.type)})</p>
                    <p className="text-[10px] text-slate-400 font-medium">{language === 'tr' ? 'Müşteri' : 'Customer'}: <strong className="text-slate-700">{order.customerName}</strong> • {order.time}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <p className="font-black text-slate-900">${order.totalAmount}</p>
                    <span className={`px-2.5 py-1 text-[9px] font-bold uppercase rounded-md ${
                      order.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' :
                      order.status === 'Preparing' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {order.status === 'Completed' ? (language === 'tr' ? 'Tamamlandı' : 'Completed') :
                       order.status === 'Preparing' ? (language === 'tr' ? 'Hazırlanıyor' : 'Preparing') :
                       order.status === 'Pending' ? (language === 'tr' ? 'Bekliyor' : 'Pending') : (language === 'tr' ? 'İptal' : 'Cancelled')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 text-center py-12">{t('no_active_station_tickets')}</p>
          )}
        </div>

        {/* Sağ Kolon: Şube Adres / İletişim Bilgileri */}
        <div className="bg-white p-6 border border-slate-200 rounded-2xl space-y-4 shadow-2xs">
          <h4 className="font-extrabold text-slate-800 text-sm tracking-tight border-b border-slate-100 pb-3">{t('contact_information')}</h4>
          
          <div className="space-y-4 text-xs font-semibold text-slate-700">
            <div>
              <p className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">{t('node_address')}</p>
              <p className="text-slate-800 mt-1 leading-relaxed">{myBranch.address}</p>
            </div>

            <div>
              <p className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">{t('telephone_line')}</p>
              <p className="text-slate-800 mt-1 leading-relaxed">{myBranch.phone || '+90 216 555 1234'}</p>
            </div>

            <div>
              <p className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">{t('operational_status')}</p>
              <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase mt-2 inline-block">
                {myBranch.status === 'Active' ? (language === 'tr' ? 'Aktif' : 'Active') : (language === 'tr' ? 'Kapalı' : 'Inactive')}
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
