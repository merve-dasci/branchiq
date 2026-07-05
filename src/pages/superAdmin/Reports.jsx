// React ve durum kancalarını (hooks) içe aktar
import React, { useState } from 'react';
// Raporlar sayfasında kullanılacak Lucide simgelerini yükle
import { 
  TrendingUp, 
  DollarSign, 
  Layers, 
  BarChart3, 
  Download, 
  Calendar 
} from 'lucide-react';
// Grafik çizimleri için Recharts bileşenlerini içe aktar
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
// Çoklu dil çeviri kancasını (t fonksiyonu) context'ten çek
import { useLanguage } from '../../context/LanguageContext.jsx';

// Süper Admin Raporlar Bileşeni
export default function Reports({ branches, menuItems, orders }) {
  // Çoklu dil sözlük çevirilerini yükle
  const { t, language } = useLanguage();
  // Zaman aralığı durum yönetimi (Hafta, Ay, Yıl)
  const [timeRange, setTimeRange] = useState('Month');

  // --- DİNAMİK VERİ HESAPLAMA ÇARPANLARI (TIME RANGE MULTIPLIER) ---
  // Seçilen zaman aralığına göre finansal ciroları ve sipariş adetlerini ölçeklendir
  const getMultiplier = () => {
    switch (timeRange) {
      case 'Week': return 0.25; // Haftalık veri aylık verinin ~dörtte biridir
      case 'Year': return 12;   // Yıllık veri aylık verinin ~12 katıdır
      default: return 1.0;      // Ay durumunda standart değerler
    }
  };

  const multiplier = getMultiplier();

  // Tüm şubelerin cirolarını topla ve zaman çarpanı ile ölçeklendir
  const totalRevenue = Math.round(branches.reduce((sum, b) => sum + (b.revenueThisMonth || 0), 0) * multiplier);
  // Toplam sipariş sayısını zaman çarpanıyla ölçeklendir
  const totalSimulatedOrders = Math.round(orders.length * multiplier);
  // Ortalama sepet ortalamasını hesapla
  const averageOrderVal = orders.length > 0 
    ? Math.round(orders.reduce((sum, o) => sum + o.totalAmount, 0) / orders.length)
    : 0;

  // --- GRAFİK 1: ŞUBE BAZLI GELİR DAĞILIMI VERİSİ ---
  const revenueData = branches.map(b => ({
    name: b.name.replace('BranchIQ ', ''), // Gösterim kolaylığı için ön eki temizle
    revenue: Math.round((b.revenueThisMonth || 0) * multiplier),
    orders: Math.round((b.dailyOrders * 30 || 0) * multiplier)
  }));

  // --- GRAFİK 2: SİPARİŞ DAĞILIM KANALLARI (PİZZA GRAFİĞİ) ---
  const orderTypes = orders.reduce((acc, o) => {
    acc[o.type] = (acc[o.type] || 0) + 1;
    return acc;
  }, {});
  
  const typeData = Object.keys(orderTypes).map(key => ({
    name: key === 'Dine-in' ? (language === 'tr' ? 'Masaya Servis' : 'Dine-in') : (language === 'tr' ? 'Paket Servis' : 'Delivery'),
    value: Math.round(orderTypes[key] * multiplier)
  }));

  // Grafik dilimleri renk paleti
  const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ec4899'];

  return (
    <div id="reports-panel" className="p-8 space-y-6 animate-fade-in">
      
      {/* Rapor Başlığı ve Kontroller (Zaman Seçici & Dışa Aktar) */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">{t('enterprise_analytics_reports')}</h2>
          <p className="text-xs text-slate-550 font-semibold">{t('monitor_financial_indices')}</p>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Zaman Aralığı Dropdown Seçicisi */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold shadow-2xs">
            <Calendar size={13} className="text-slate-400" />
            <select 
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-transparent border-none focus:outline-hidden text-slate-700 cursor-pointer"
            >
              <option value="Week">{t('this_week')}</option>
              <option value="Month">{t('this_month')}</option>
              <option value="Year">{t('fiscal_year')}</option>
            </select>
          </div>

          {/* Tarayıcı Yazdırma / PDF Çıktı Butonu */}
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-850 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl cursor-pointer shadow-md transition-all duration-150"
          >
            <Download size={13} />
            <span>{t('export_ledger')}</span>
          </button>
        </div>
      </div>

      {/* KPI Özet Rapor Kartları (Stats Summary cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Toplam Bölgesel Gelir */}
        <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-2xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('gross_regional_income')}</p>
          <h4 className="text-2xl font-black text-slate-900 mt-1">${totalRevenue.toLocaleString()}</h4>
          <span className="text-[10px] text-emerald-600 font-bold mt-1 inline-block">↑ 14.5% {t('vs_last_period')}</span>
        </div>

        {/* Toplam Sipariş Defteri */}
        <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-2xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('fulfilled_orders_ledger')}</p>
          <h4 className="text-2xl font-black text-slate-900 mt-1">{totalSimulatedOrders.toLocaleString()}</h4>
          <span className="text-[10px] text-emerald-600 font-bold mt-1 inline-block">↑ 6.2% {t('vs_last_period')}</span>
        </div>

        {/* Ortalama Bilet Sepeti */}
        <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-2xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('average_ticket_valuation')}</p>
          <h4 className="text-2xl font-black text-slate-900 mt-1">${averageOrderVal}</h4>
          <span className="text-[10px] text-slate-400 font-bold mt-1 inline-block">{t('consolidated_ticket_price')}</span>
        </div>

        {/* Ortalama Şube Kalite Puanı */}
        <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-2xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('average_store_rating')}</p>
          <h4 className="text-2xl font-black text-amber-500 mt-1">4.62 / 5.0</h4>
          <span className="text-[10px] text-slate-400 font-bold mt-1 inline-block">{t('customer_satisfaction_index')}</span>
        </div>
      </div>

      {/* Rapor Analitik Grafik Blokları */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Kolon Grafiği: Şubeler Gelir Dağılım Karşılaştırması */}
        <div className="lg:col-span-2 bg-white p-6 border border-slate-200 rounded-2xl shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-slate-50 pb-3">
            <h4 className="font-extrabold text-slate-800 text-sm tracking-tight flex items-center gap-1.5">
              <BarChart3 size={16} className="text-blue-500" />
              <span>{t('consolidated_revenue_comparison')}</span>
            </h4>
            <span className="text-[9px] font-bold uppercase text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md">USD ($)</span>
          </div>
          
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip cursor={{ fill: '#f8fafc' }} formatter={(value) => `$${value.toLocaleString()}`} />
                <Bar dataKey="revenue" fill="#2563eb" radius={[4, 4, 0, 0]} barSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pasta Grafiği: Sipariş Kanalı Dağılımı */}
        <div className="bg-white p-6 border border-slate-200 rounded-2xl shadow-xs space-y-4">
          <div className="border-b border-slate-50 pb-3">
            <h4 className="font-extrabold text-slate-800 text-sm tracking-tight flex items-center gap-1.5">
              <Layers size={16} className="text-indigo-500" />
              <span>{t('order_fulfilment_channel')}</span>
            </h4>
          </div>

          <div className="h-56 flex items-center justify-center">
            {typeData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={typeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {typeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value.toLocaleString()} ${t('orders') || 'Orders'}`} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs text-slate-400 font-medium">{t('no_channel_records')}</p>
            )}
          </div>

          {/* Dilim Renk Açıklamaları */}
          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-50 text-[10px] font-bold">
            {typeData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-slate-550">{entry.name}: {entry.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
