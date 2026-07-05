// React ve yerel durum kancalarını (hooks) içe aktar
import React, { useState } from 'react';
// Arayüzde kullanılacak modern simgeleri Lucide React paketinden ekle
import { 
  Store, 
  ShoppingBag, 
  DollarSign, 
  Users, 
  TrendingUp, 
  ChevronRight,
  Percent,
  Clock,
  Sparkles,
  ClipboardList,
  Terminal
} from 'lucide-react';
// Recharts kütüphanesinden grafik çizmek için gerekli bileşenleri ekle
import { 
  ResponsiveContainer, 
  AreaChart, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Area, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
// Çoklu dil çeviri kancasını (t fonksiyonu) context'ten çek
import { useLanguage } from '../../context/LanguageContext.jsx';
// Redux durumlarını (state) okumak ve eylemleri tetiklemek için kancaları yükle
import { useSelector, useDispatch } from 'react-redux';
// Redux terminal loglarını temizlemek için kullanılan eylemi import et
import { clearLogs } from '../../features/logs/reduxLogsSlice.js';

// Süper Admin Dashboard Ana Bileşeni
export default function SuperAdminDashboard({ 
  branches, 
  menuItems, 
  orders, 
  staff, 
  announcements, 
  selectedRegion, 
  setActiveTab 
}) {
  // Çoklu dil sözlük çevirilerini yükle
  const { t, language } = useLanguage();
  // Redux dispatch referansını tanımla
  const dispatch = useDispatch();
  // Grafik zaman aralığı durum yönetimi (7 gün vs 30 gün)
  const [timeRange, setTimeRange] = useState('7d');
  // Redux store'dan en son tetiklenen log kayıtlarını dizi halinde oku
  const reduxLogs = useSelector(state => state.reduxLogs.items);
  
  // --- BÖLGESEL FİLTRELEME İŞLEMLERİ (REGIONAL FILTERING) ---
  // Seçili bölgeye göre şubeleri süz (Bölge 'All' ise tümünü getir)
  const regionalBranches = selectedRegion === 'All' 
    ? branches 
    : branches.filter(b => b.region === selectedRegion);

  // Süzülmüş şubelerin benzersiz ID listesini (array of IDs) çıkar
  const regionalBranchIds = regionalBranches.map(b => b.id);

  // Siparişleri seçilen şube ID'lerine göre filtrele
  const regionalOrders = orders.filter(order => {
    return selectedRegion === 'All' || regionalBranchIds.includes(order.branchId);
  });

  // Çalışan personelleri seçilen şube ID'lerine göre filtrele
  const regionalStaff = staff.filter(m => {
    return selectedRegion === 'All' || regionalBranchIds.includes(m.branchId);
  });

  // --- KPI DEĞERLERİNİN HESAPLANMASI (KPI CALCULATIONS) ---
  // Bölgedeki şubelerin aylık brüt cirolarını topla
  const totalRevenue = regionalBranches.reduce((sum, b) => sum + b.revenueThisMonth, 0);
  // Bölgedeki toplam sipariş adetini hesapla
  const totalOrders = regionalOrders.length;
  // Ortalama sepet tutarını hesapla (Toplam Tutar / Sipariş Sayısı)
  const avgOrderValue = totalOrders > 0 ? Number((regionalOrders.reduce((sum, o) => sum + o.totalAmount, 0) / totalOrders).toFixed(2)) : 0;
  // Bölgedeki toplam personel sayısını al
  const staffCount = regionalStaff.length;

  // Hazırlanan veya Bekleyen (Pending/Preparing) sipariş sayısını bul
  const activeOrdersCount = regionalOrders.filter(o => o.status === 'Pending' || o.status === 'Preparing').length;

  // --- RECHARTS GRAFİK VERİSİ ÜRETİMİ (CHART TREND DATA) ---
  // Zaman aralığı 7 gün ise statik haftalık trendi, 30 gün ise formüle bağlı 30 günlük sinüzoidal trendi oluştur
  const ordersTrendData = timeRange === '7d' ? [
    { day: language === 'tr' ? 'Pzt' : 'Mon', revenue: 4200, orders: 120 },
    { day: language === 'tr' ? 'Sal' : 'Tue', revenue: 5100, orders: 142 },
    { day: language === 'tr' ? 'Çar' : 'Wed', revenue: 4900, orders: 135 },
    { day: language === 'tr' ? 'Per' : 'Thu', revenue: 6200, orders: 180 },
    { day: language === 'tr' ? 'Cum' : 'Fri', revenue: 8400, orders: 240 },
    { day: language === 'tr' ? 'Cmt' : 'Sat', revenue: 9500, orders: 280 },
    { day: language === 'tr' ? 'Paz' : 'Sun', revenue: 7800, orders: 210 }
  ] : Array.from({ length: 30 }, (_, i) => {
    const dayNum = i + 1;
    // 30 günlük sinusoidal dalga verisi üreterek grafiğin dalgalı görünmesini sağlar
    const baseRevenue = 4000 + (dayNum * 130);
    const wave = Math.sin(dayNum * 0.7) * 1600;
    const randomNoise = (dayNum % 7 === 5 || dayNum % 7 === 6) ? 1400 : 0;
    const revenue = Math.round(baseRevenue + wave + randomNoise);
    return {
      day: `${dayNum}.06`,
      revenue,
      orders: Math.round(revenue / 35)
    };
  });

  // Bölgesel şube ciro dağılımını hesapla (Pasta grafik - Pie Chart için)
  const regionColors = ['#0f172a', '#2563eb', '#10b981', '#f59e0b', '#ec4899'];
  const regionDistribution = branches.reduce((acc, branch) => {
    const existing = acc.find(item => item.name === branch.region);
    if (existing) {
      existing.value += branch.revenueThisMonth;
    } else {
      acc.push({ name: branch.region, value: branch.revenueThisMonth });
    }
    return acc;
  }, []);

  return (
    <div id="overview-panel" className="p-8 space-y-6 animate-fade-in">

      {/* 1. Üst Duyuru Panosu (Announcement Banner) */}
      {announcements.length > 0 && (
        <div id="top-announcement-banner" className="bg-slate-900 text-white rounded-2xl p-5 flex items-center justify-between shadow-lg relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="flex items-center gap-4 relative">
            <div className="p-3 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/10">
              <Sparkles size={20} className="animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">{t('latest_broadcast_notice')}</span>
              <h4 className="text-sm sm:text-base font-extrabold tracking-tight mt-0.5">{announcements[0].title}</h4>
              <p className="text-xs text-slate-400 mt-1 line-clamp-1 max-w-2xl font-medium">{announcements[0].content}</p>
            </div>
          </div>
          <button 
            id="read-announcement-banner-btn"
            onClick={() => setActiveTab('announcements')} 
            className="flex items-center gap-1.5 text-xs font-bold bg-white/10 hover:bg-white/15 text-white py-2 px-3.5 rounded-xl border border-white/5 transition-all cursor-pointer relative"
          >
            <span>{t('view_board')}</span>
            <ChevronRight size={14} />
          </button>
        </div>
      )}

      {/* 2. Temel KPI Kartları Izgarası (Primary KPI Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Aylık Toplam Ciro Kartı */}
        <div id="kpi-revenue" className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs hover:shadow-md transition-all duration-150">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('monthly_gross_revenue')}</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">${totalRevenue.toLocaleString()}</h3>
            </div>
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <DollarSign size={20} />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-4 text-xs font-semibold text-emerald-600">
            <TrendingUp size={14} />
            <span>+12.4% {t('revenue_vs_last_month')}</span>
          </div>
        </div>

        {/* Toplam Sipariş Kartı */}
        <div id="kpi-orders" className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs hover:shadow-md transition-all duration-150">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('aggregate_orders')}</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{totalOrders}</h3>
            </div>
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <ShoppingBag size={20} />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-4 text-xs font-semibold text-blue-600">
            <TrendingUp size={14} />
            <span>+8.2% {t('orders_vs_last_week')}</span>
          </div>
        </div>

        {/* Ortalama Sepet Değeri Kartı */}
        <div id="kpi-ticket" className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs hover:shadow-md transition-all duration-150">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('average_ticket_value')}</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">${avgOrderValue}</h3>
            </div>
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
              <Percent size={20} />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-4 text-xs font-semibold text-amber-600">
            <TrendingUp size={14} />
            <span>+4.1% {t('pricing_optimization')}</span>
          </div>
        </div>

        {/* Aktif Personel Sayısı Kartı */}
        <div id="kpi-staff" className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs hover:shadow-md transition-all duration-150">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('active_staff_members')}</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{staffCount}</h3>
            </div>
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
              <Users size={20} />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-4 text-xs font-semibold text-slate-500">
            <Clock size={14} />
            <span>{regionalBranches.length} {t('across_branches')}</span>
          </div>
        </div>

      </div>

      {/* 3. Grafikler ve Mutfak Sipariş Panelleri (Charts & Orders Column Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sistem Ciro Alan Grafiği (Area Chart) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h4 className="text-sm font-bold text-slate-900">{t('weekly_system_revenue')}</h4>
              <p className="text-[11px] text-slate-400 font-semibold">{t('consolidated_billing')}</p>
            </div>
            <div className="flex items-center gap-3">
              {/* Zaman Aralığı Filtre Seçicisi (7 gün / 30 gün) */}
              <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                <button
                  onClick={() => setTimeRange('7d')}
                  className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    timeRange === '7d' 
                      ? 'bg-white text-blue-600 shadow-xs' 
                      : 'text-slate-550 hover:text-slate-800'
                  }`}
                >
                  {t('last_7_days')}
                </button>
                <button
                  onClick={() => setTimeRange('30d')}
                  className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    timeRange === '30d' 
                      ? 'bg-white text-blue-600 shadow-xs' 
                      : 'text-slate-555 hover:text-slate-800'
                  }`}
                >
                  {t('last_30_days')}
                </button>
              </div>
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md uppercase">{t('live_feed')}</span>
            </div>
          </div>
          <div className="h-72">
            {/* Recharts Alan Grafiği Çizimi */}
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ordersTrendData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                <Tooltip 
                  contentStyle={{ background: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff' }}
                  labelStyle={{ fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="revenue" name={t('monthly_gross_revenue')} stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bölgesel Şube Dağılım Grafiği (Pie Chart) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-1">{t('region_share')}</h4>
            <p className="text-[11px] text-slate-400 font-semibold mb-4">{t('revenue_split_nodes')}</p>
          </div>
          <div className="h-44 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={regionDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {regionDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={regionColors[index % regionColors.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Bölge Etiket Renk Açıklamaları */}
          <div className="grid grid-cols-2 gap-2 mt-4 text-[10px] font-bold text-slate-650">
            {regionDistribution.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs" style={{ backgroundColor: regionColors[index % regionColors.length] }}></span>
                <span className="truncate">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 4. Alt Bölge: Mutfak Sipariş Sırası ve Şube Durum Deck Panelleri */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Mutfak Sipariş Sırası Bilet Takip Kartı */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900">{t('kitchen_queues_overview')}</h4>
              <p className="text-[11px] text-slate-400 font-semibold">{activeOrdersCount} {t('active_tickets')}</p>
            </div>
            <button 
              id="goto-orders-btn"
              onClick={() => setActiveTab('orders')} 
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-0.5"
            >
              <span>{t('manage_queues')}</span>
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="flex-1 divide-y divide-slate-100 overflow-y-auto max-h-60">
            {regionalOrders.filter(o => o.status === 'Pending' || o.status === 'Preparing').length > 0 ? (
              regionalOrders.filter(o => o.status === 'Pending' || o.status === 'Preparing').slice(0, 5).map(order => (
                <div key={order.id} className="py-3 flex items-center justify-between text-xs font-semibold">
                  <div>
                    <p className="text-slate-800 font-bold">{order.customerName} <span className="font-mono text-slate-400">({order.id})</span></p>
                    <p className="text-[10px] text-slate-400 mt-0.5 font-medium">{order.branchName} • {order.type} • {order.time}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                      order.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {order.status === 'Pending' ? t('pending') || 'Pending' : t('preparing') || 'Preparing'}
                    </span>
                    <span className="font-extrabold text-slate-900">${order.totalAmount}</span>
                  </div>
                </div>
              ))
            ) : (
              // Aktif Bilet Yoksa Gösterilecek Boş Şablon
              <div className="py-8 text-center text-slate-400">
                <ClipboardList size={32} className="mx-auto text-slate-200 mb-2" />
                <p className="text-xs font-semibold">{t('no_pending_orders')}</p>
              </div>
            )}
          </div>
        </div>

        {/* Şube Operasyonları Durum Paneli */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col">
          <h4 className="text-sm font-bold text-slate-900 mb-1">{t('branch_operations_status')}</h4>
          <p className="text-[11px] text-slate-400 font-semibold mb-4">{t('functional_state_nodes')}</p>
          
          <div className="flex-1 divide-y divide-slate-100 overflow-y-auto max-h-60">
            {regionalBranches.map(branch => (
              <div key={branch.id} className="py-3.5 flex items-center justify-between text-xs font-semibold">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-slate-50 text-slate-500 rounded-lg">
                    <Store size={14} />
                  </div>
                  <div>
                    <p className="text-slate-800 font-bold">{branch.name}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5 font-medium">{t('manager')}: {branch.manager}</p>
                  </div>
                </div>
                {/* Şubenin Çalışma Durumu (Online/Offline) */}
                <span className={`flex items-center gap-1.5 text-[10px] font-black uppercase ${
                  branch.status === 'Active' ? 'text-emerald-600' : 'text-slate-400'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    branch.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-300'
                  }`}></span>
                  <span>{branch.status === 'Active' ? t('online') : t('offline')}</span>
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 5. Canlı Redux Event Log Konsolu (Live Redux Event Console Terminal) */}
      <div className="bg-slate-900 text-slate-100 rounded-2xl p-6 shadow-xl border border-slate-800 space-y-4">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Terminal size={18} className="text-rose-500 animate-pulse" />
            <h4 className="text-xs font-black uppercase tracking-wider text-rose-550">{t('live_redux_console')}</h4>
          </div>
          {/* Konsol Temizleme Butonu */}
          <button
            onClick={() => dispatch(clearLogs())}
            className="text-[10px] font-black uppercase bg-slate-800 hover:bg-slate-700 text-slate-300 py-1.5 px-3 rounded-lg border border-slate-700 transition-all cursor-pointer"
          >
            {t('clear_console')}
          </button>
        </div>
        {/* Terminal Kaydırma Kutusu */}
        <div className="bg-slate-950 rounded-xl p-4 h-40 overflow-y-auto font-mono text-[10px] leading-relaxed text-emerald-400 space-y-1.5 border border-slate-900 shadow-inner">
          {reduxLogs.length > 0 ? (
            reduxLogs.map((log, idx) => (
              <div key={idx} className="flex gap-2">
                <span className="text-slate-650 select-none">&gt;</span>
                <span>{log}</span>
              </div>
            ))
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500 italic select-none">
              {t('no_events_logged')}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
