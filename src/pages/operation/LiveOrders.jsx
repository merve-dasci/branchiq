// React ve durum/etki kancalarını (hooks) içe aktar
import React, { useEffect, useState } from 'react';
// Operasyon ekranında kullanılacak simgeleri Lucide React paketinden yükle
import { 
  ClipboardList, 
  Search, 
  Clock, 
  ShoppingBag, 
  TrendingUp 
} from 'lucide-react';
// Redux store bağlantısı ve sipariş güncelleme thunk eylemlerini import et
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders, updateOrder } from '../../features/orders/ordersSlice.js';
// Çoklu dil kancasını içe aktar
import { useLanguage } from '../../context/LanguageContext.jsx';

// Operasyon Admin Canlı Sipariş Monitörü
export default function LiveOrders({ currentUser }) {
  const dispatch = useDispatch();
  const { t, language } = useLanguage();
  // Redux store'dan sipariş listesini oku
  const { items, loading, error } = useSelector((state) => state.orders);

  // Arama filtresi durumu
  const [searchQuery, setSearchQuery] = useState('');

  // Sayfa yüklendiğinde siparişleri sunucudan çek
  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  // Giriş yapmış kullanıcının şube ID'sini al
  const targetBranchId = currentUser?.branchId || '';

  // Siparişleri şubeye göre filtrele
  const branchOrders = items.filter(o => o.branchId === targetBranchId);

  // Arama kelimesine göre sipariş kodunu, masa numarasını veya müşteri adını süz
  const filteredOrders = branchOrders.filter(order => {
    const table = order.tableNumber || (language === 'tr' ? 'Masa ' : 'Table ') + (order.id.slice(-2) % 15 + 1);
    const matchesSearch = 
      order.id?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      String(table).toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Belirli durumlara sahip siparişleri filtreleyen yardımcı metot
  const getOrdersByStatus = (ordersList, statusNames) => {
    return ordersList.filter(o => statusNames.includes(o.status?.toLowerCase()));
  };

  // Siparişleri kanban aşamalarına böl
  const newOrders = getOrdersByStatus(filteredOrders, ['pending', 'new']);
  const preparingOrders = getOrdersByStatus(filteredOrders, ['preparing']);
  const readyOrders = getOrdersByStatus(filteredOrders, ['ready']);
  const completedOrders = getOrdersByStatus(filteredOrders, ['completed']);

  // --- OPERASYONEL HESAPLAMALAR VE KPI DEĞERLERİ ---
  // Teslim edilmemiş aktif sipariş sayısı
  const activeCount = branchOrders.filter(o => ['pending', 'new', 'preparing', 'ready'].includes(o.status?.toLowerCase())).length;
  // Teslim edilmeye hazır sipariş sayısı
  const readyCount = branchOrders.filter(o => o.status?.toLowerCase() === 'ready').length;
  
  // Aktif sipariş sayısına göre mutfak yoğunluğunu hesapla
  let kitchenLoad = language === 'tr' ? 'Düşük (12%)' : 'Low (12%)';
  if (activeCount > 6) {
    kitchenLoad = language === 'tr' ? 'Yüksek (85%)' : 'High (85%)';
  } else if (activeCount > 2) {
    kitchenLoad = language === 'tr' ? 'Orta (55%)' : 'Medium (55%)';
  }

  // Sipariş durumunu güncelle
  const handleUpdateStatus = (order, nextStatus) => {
    dispatch(updateOrder({ ...order, status: nextStatus }));
  };

  return (
    <div id="live-orders-panel" className="p-8 space-y-6 animate-fade-in">
      
      {/* Üst Başlık */}
      <div className="flex justify-between items-center">
        <div>
          <span className="bg-emerald-600 text-[10px] uppercase font-black tracking-widest px-2.5 py-1 rounded-md text-white">{t('ops_dashboard')}</span>
          <h2 className="text-xl font-black text-slate-900 tracking-tight mt-2.5">{t('live_order_monitor')}</h2>
          <p className="text-xs text-slate-500 font-semibold font-sans">{t('monitor_active_orders')}</p>
        </div>
      </div>

      {/* KPI Kart Paneli */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        {/* Aktif Siparişler */}
        <div className="bg-white p-5 border border-slate-200 rounded-2xl flex justify-between items-center shadow-xs">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('active_orders')}</p>
            <h4 className="text-2xl font-black text-blue-600 mt-1">{activeCount}</h4>
          </div>
          <ClipboardList className="text-blue-500" size={20} />
        </div>

        {/* Ortalama Hazırlık Süresi */}
        <div className="bg-white p-5 border border-slate-200 rounded-2xl flex justify-between items-center shadow-xs">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('avg_prep_time')}</p>
            <h4 className="text-2xl font-black text-slate-800 mt-1">18 dk</h4>
          </div>
          <Clock className="text-slate-400" size={20} />
        </div>

        {/* Hazır Siparişler */}
        <div className="bg-white p-5 border border-slate-200 rounded-2xl flex justify-between items-center shadow-xs">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('ready_for_pickup')}</p>
            <h4 className="text-2xl font-black text-emerald-600 mt-1">{readyCount}</h4>
          </div>
          <ShoppingBag className="text-emerald-500" size={20} />
        </div>

        {/* Mutfak Yük Oranı */}
        <div className="bg-white p-5 border border-slate-200 rounded-2xl flex justify-between items-center shadow-xs">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('kitchen_load')}</p>
            <h4 className="text-2xl font-black text-amber-600 mt-1">{kitchenLoad}</h4>
          </div>
          <TrendingUp className="text-amber-500" size={20} />
        </div>
      </div>

      {/* Arama Filtre Kutusu */}
      <div className="flex gap-4 items-center bg-white p-4 border border-slate-200 rounded-2xl shadow-xs">
        <div className="relative w-full max-w-md">
          <Search size={14} className="absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder={language === 'tr' ? "Aktif siparişleri kod, masa veya müşteri adına göre aratın..." : "Search active orders by number, table, or guest name..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 font-semibold"
          />
        </div>
      </div>

      {/* 4 Kolonlu Canlı Sipariş Takip Panosu (Live Order Kanban) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* KOLON 1: YENİ (NEW) */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col space-y-4">
          <div className="flex justify-between items-center border-b border-slate-200 pb-2">
            <span className="text-[11px] font-black text-slate-700 uppercase tracking-wider">{t('new_tickets')}</span>
            <span className="bg-blue-100 text-blue-800 text-[10px] px-2 py-0.5 rounded-full font-bold">{newOrders.length}</span>
          </div>
          <div className="space-y-4 overflow-y-auto max-h-[500px] pr-1">
            {newOrders.map(order => (
              <LiveOrderCard 
                key={order.id} 
                order={order} 
                onAction={() => handleUpdateStatus(order, 'Preparing')} 
                actionLabel={t('fire_prep')}
                actionClass="bg-blue-600 hover:bg-blue-700 text-white"
                language={language}
              />
            ))}
            {newOrders.length === 0 && <EmptyCol language={language} />}
          </div>
        </div>

        {/* KOLON 2: HAZIRLANIYOR (PREPARING) */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col space-y-4">
          <div className="flex justify-between items-center border-b border-slate-200 pb-2">
            <span className="text-[11px] font-black text-slate-700 uppercase tracking-wider">{t('preparing')}</span>
            <span className="bg-amber-100 text-amber-800 text-[10px] px-2 py-0.5 rounded-full font-bold">{preparingOrders.length}</span>
          </div>
          <div className="space-y-4 overflow-y-auto max-h-[500px] pr-1">
            {preparingOrders.map(order => (
              <LiveOrderCard 
                key={order.id} 
                order={order} 
                onAction={() => handleUpdateStatus(order, 'Ready')} 
                actionLabel={t('ready_up')}
                actionClass="bg-amber-600 hover:bg-amber-700 text-white"
                language={language}
              />
            ))}
            {preparingOrders.length === 0 && <EmptyCol language={language} />}
          </div>
        </div>

        {/* KOLON 3: HAZIR (READY) */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col space-y-4">
          <div className="flex justify-between items-center border-b border-slate-200 pb-2">
            <span className="text-[11px] font-black text-slate-700 uppercase tracking-wider">{t('ready_for_service')}</span>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-bold">{readyOrders.length}</span>
          </div>
          <div className="space-y-4 overflow-y-auto max-h-[500px] pr-1">
            {readyOrders.map(order => (
              <LiveOrderCard 
                key={order.id} 
                order={order} 
                onAction={() => handleUpdateStatus(order, 'Completed')} 
                actionLabel={t('complete')}
                actionClass="bg-emerald-600 hover:bg-emerald-700 text-white"
                language={language}
              />
            ))}
            {readyOrders.length === 0 && <EmptyCol language={language} />}
          </div>
        </div>

        {/* KOLON 4: TAMAMLANMIŞ SİPARİŞLER (COMPLETED) */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col space-y-4">
          <div className="flex justify-between items-center border-b border-slate-200 pb-2">
            <span className="text-[11px] font-black text-slate-700 uppercase tracking-wider">{t('completed') || 'Completed'}</span>
            <span className="bg-slate-200 text-slate-700 text-[10px] px-2 py-0.5 rounded-full font-bold">{completedOrders.length}</span>
          </div>
          <div className="space-y-4 overflow-y-auto max-h-[500px] pr-1">
            {completedOrders.map(order => (
              <LiveOrderCard 
                key={order.id} 
                order={order}
                language={language}
              />
            ))}
            {completedOrders.length === 0 && <EmptyCol language={language} />}
          </div>
        </div>

      </div>
    </div>
  );
}

// Kanban Kart Bileşeni
function LiveOrderCard({ order, onAction, actionLabel, actionClass, language }) {
  const table = order.tableNumber || (language === 'tr' ? 'Masa ' : 'Table ') + (order.id.slice(-2) % 15 + 1);
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-3.5 hover:shadow-sm transition-all flex flex-col gap-2.5 text-xs">
      <div className="flex justify-between items-start">
        <div>
          <span className="font-black text-slate-900 block">{order.id}</span>
          <span className="text-[9px] font-bold text-slate-400 block uppercase mt-0.5">{order.time}</span>
        </div>
        <span className="bg-slate-100 border border-slate-200 text-slate-700 text-[9px] font-black px-1.5 py-0.5 rounded-md">
          {table}
        </span>
      </div>

      <div className="space-y-1">
        <p className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider">{language === 'tr' ? 'Müşteri Bilgileri' : 'Guest details'}</p>
        <p className="font-bold text-slate-700">{order.customerName}</p>
        <div className="text-[10px] text-slate-500 flex items-center gap-1">
          <span>{order.items?.length || 0} {language === 'tr' ? 'ürün' : 'items'} •</span>
          <span className="font-extrabold text-slate-800">${order.totalAmount}</span>
        </div>
      </div>

      {onAction && (
        <button
          onClick={onAction}
          className={`w-full py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${actionClass}`}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

// Boş Kolon Görünümü
function EmptyCol({ language }) {
  return (
    <div className="border border-dashed border-slate-350 rounded-xl py-6 text-center text-slate-400 bg-white/40 text-[9px] font-bold uppercase">
      {language === 'tr' ? 'Kuyruk Boş' : 'Empty Queue'}
    </div>
  );
}
