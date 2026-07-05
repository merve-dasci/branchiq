// React ve etki kancasını (useEffect) içe aktar
import React, { useEffect } from 'react';
// Mutfak kuyruğu simgelerini Lucide React paketinden yükle
import { 
  ClipboardList, 
  Clock, 
  Check, 
  ChefHat,
  Play,
  RotateCcw,
  AlertTriangle
} from 'lucide-react';
// Redux eylemleri ve store bağlantı kancalarını yükle
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders, updateOrder } from '../../features/orders/ordersSlice.js';
// Çoklu dil kancasını içe aktar
import { useLanguage } from '../../context/LanguageContext.jsx';

// Operasyon Admin Mutfak Sipariş Kuyruğu Bileşeni
export default function KitchenQueue({ currentUser }) {
  const dispatch = useDispatch();
  const { t, language } = useLanguage();
  // Redux store'dan güncel sipariş listesini al
  const { items, loading, error } = useSelector((state) => state.orders);

  // Sayfa yüklendiğinde sipariş listesini sunucudan çek
  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  // Giriş yapmış kullanıcının şube ID'sini al
  const targetBranchId = currentUser?.branchId || '';

  // Siparişleri sadece bu şubeye ait olanlar şeklinde süz
  const branchOrders = items.filter(o => o.branchId === targetBranchId);

  // Belirli durumlara sahip sipariş biletlerini gruplayan yardımcı metot
  const getOrdersByStatus = (statusList) => {
    return branchOrders.filter(o => {
      const status = o.status?.toLowerCase();
      return statusList.includes(status);
    });
  };

  // Siparişleri durum kolonlarına göre grupla
  const newOrders = getOrdersByStatus(['pending', 'new']);
  const preparingOrders = getOrdersByStatus(['preparing']);
  const readyOrders = getOrdersByStatus(['ready']);

  // Siparişin mutfak durumunu güncelle (Hazırlanıyor, Hazır, Tamamlandı vb.)
  const handleUpdateStatus = (order, nextStatus) => {
    dispatch(updateOrder({ ...order, status: nextStatus }));
  };

  // Sipariş önceliğine göre görsel renk kartı atayan yardımcı metot
  const getPriorityColor = (priority) => {
    const p = priority?.toLowerCase() || 'medium';
    if (p === 'high') return 'bg-rose-50 border-rose-200 text-rose-700';
    if (p === 'low') return 'bg-emerald-50 border-emerald-200 text-emerald-700';
    return 'bg-amber-50 border-amber-200 text-amber-700';
  };

  return (
    <div id="kitchen-queue-panel" className="p-8 space-y-6 animate-fade-in">
      
      {/* Üst Başlık Bilgisi */}
      <div className="flex justify-between items-center">
        <div>
          <span className="bg-amber-600 text-[10px] uppercase font-black tracking-widest px-2.5 py-1 rounded-md text-white">{t('kitchen_console')}</span>
          <h2 className="text-xl font-black text-slate-900 tracking-tight mt-2.5">{t('live_kitchen_queue')}</h2>
          <p className="text-xs text-slate-500 font-semibold font-sans">{t('track_cooking_tickets')}</p>
        </div>
        
        <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-xl text-xs font-bold animate-pulse">
          <ChefHat size={14} />
          <span>{t('kitchen_engine_active')}</span>
        </div>
      </div>

      {/* Sipariş Sayacı KPI Kartları */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('incoming_tickets_new')}</p>
          <h4 className="text-2xl font-black text-blue-600 mt-1">
            {newOrders.length}
          </h4>
        </div>
        <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('active_in_prep')}</p>
          <h4 className="text-2xl font-black text-amber-600 mt-1">
            {preparingOrders.length}
          </h4>
        </div>
        <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('ready_for_pickup')}</p>
          <h4 className="text-2xl font-black text-emerald-600 mt-1">
            {readyOrders.length}
          </h4>
        </div>
      </div>

      {/* 3 Kolonlu Mutfak Kanban Tahtası (Kanban Board) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* KOLON 1: YENİ SİPARİŞLER (NEW) */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col space-y-4">
          <div className="flex justify-between items-center border-b border-slate-200 pb-2">
            <span className="text-xs font-black text-slate-800 uppercase tracking-wider">{t('new_tickets')}</span>
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full font-bold">{newOrders.length}</span>
          </div>
          <div className="space-y-4 overflow-y-auto max-h-[600px] pr-1">
            {newOrders.length > 0 ? (
              newOrders.map(order => (
                <OrderCard 
                  key={order.id} 
                  order={order} 
                  onAction={() => handleUpdateStatus(order, 'Preparing')} 
                  actionLabel={t('mark_preparing')}
                  actionIcon={<Play size={13} />}
                  actionClass="bg-blue-600 hover:bg-blue-700 text-white"
                  getPriorityColor={getPriorityColor}
                  t={t}
                  language={language}
                />
              ))
            ) : (
              <EmptyColumnState message={t('no_new_tickets')} />
            )}
          </div>
        </div>

        {/* KOLON 2: HAZIRLANANLAR (PREPARING) */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col space-y-4">
          <div className="flex justify-between items-center border-b border-slate-200 pb-2">
            <span className="text-xs font-black text-slate-800 uppercase tracking-wider">{t('preparing')}</span>
            <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full font-bold">{preparingOrders.length}</span>
          </div>
          <div className="space-y-4 overflow-y-auto max-h-[600px] pr-1">
            {preparingOrders.length > 0 ? (
              preparingOrders.map(order => (
                <OrderCard 
                  key={order.id} 
                  order={order} 
                  onAction={() => handleUpdateStatus(order, 'Ready')} 
                  actionLabel={t('mark_ready')}
                  actionIcon={<Check size={13} />}
                  actionClass="bg-amber-600 hover:bg-amber-700 text-white"
                  getPriorityColor={getPriorityColor}
                  t={t}
                  language={language}
                />
              ))
            ) : (
              <EmptyColumnState message={t('no_orders_preparing')} />
            )}
          </div>
        </div>

        {/* KOLON 3: HAZIR / TESLİM AŞAMASI (READY) */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col space-y-4">
          <div className="flex justify-between items-center border-b border-slate-200 pb-2">
            <span className="text-xs font-black text-slate-800 uppercase tracking-wider">{t('ready_for_service')}</span>
            <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-0.5 rounded-full font-bold">{readyOrders.length}</span>
          </div>
          <div className="space-y-4 overflow-y-auto max-h-[600px] pr-1">
            {readyOrders.length > 0 ? (
              readyOrders.map(order => (
                <OrderCard 
                  key={order.id} 
                  order={order} 
                  onAction={() => handleUpdateStatus(order, 'Completed')} 
                  actionLabel={t('complete_order')}
                  actionIcon={<Check size={13} />}
                  actionClass="bg-emerald-600 hover:bg-emerald-700 text-white"
                  getPriorityColor={getPriorityColor}
                  t={t}
                  language={language}
                />
              ))
            ) : (
              <EmptyColumnState message={t('no_orders_ready')} />
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

// Kanban Kolonları İçin Yeniden Kullanılabilir Sipariş Bilet Kartı (OrderCard)
function OrderCard({ order, onAction, actionLabel, actionIcon, actionClass, getPriorityColor, t, language }) {
  const table = order.tableNumber || (language === 'tr' ? 'Masa ' : 'Table ') + (order.id.slice(-2) % 15 + 1);
  const priority = order.priority || (order.id.slice(-2) % 3 === 0 ? 'High' : 'Medium');

  return (
    <div className="p-4 rounded-xl border bg-white border-slate-200 hover:shadow-md transition-all flex flex-col gap-3.5">
      {/* Bilet Üst Başlık Bilgisi */}
      <div className="flex justify-between items-start border-b border-slate-100 pb-2.5">
        <div>
          <h4 className="text-xs font-black text-slate-900">{order.id}</h4>
          <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">
            {order.type === 'Dine-in' ? (language === 'tr' ? 'Masa' : 'Dine-in') : (language === 'tr' ? 'Paket' : 'Delivery')} • {order.time}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <span className={`px-2 py-0.5 rounded-md text-[8px] font-bold uppercase border ${getPriorityColor(priority)}`}>
            {priority === 'High' ? (language === 'tr' ? 'Yüksek' : 'High') : (language === 'tr' ? 'Orta' : 'Medium')}
          </span>
          <span className="text-[10px] font-bold text-blue-600">{table}</span>
        </div>
      </div>

      {/* Sipariş Edilen Yemeklerin Listesi */}
      <div className="flex-1 space-y-2">
        <p className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider">{t('dish_prep_checklist')}</p>
        <div className="space-y-1">
          {order.items?.map((dish, i) => (
            <div key={i} className="flex justify-between text-[11px] font-semibold text-slate-700">
              <span>{dish.name}</span>
              <span className="text-slate-900 font-black">x{dish.quantity}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Özel Müşteri İstekleri */}
      <div className="bg-slate-50 p-2 rounded-lg text-[10px] text-slate-500 font-medium border border-slate-100">
        <span className="font-bold text-slate-400 uppercase text-[8px] block mb-0.5">{t('special_requests')}</span>
        {order.notes || t('no_special_requests')}
      </div>

      {/* Durum İlerletme Butonu */}
      <div className="pt-2 border-t border-slate-100">
        <button
          onClick={onAction}
          className={`w-full flex items-center justify-center gap-1.5 font-bold py-2 rounded-xl text-[10px] uppercase tracking-wide cursor-pointer transition-all ${actionClass}`}
        >
          {actionIcon}
          <span>{actionLabel}</span>
        </button>
      </div>
    </div>
  );
}

// Boş Kolon Durum Bildirgesi
function EmptyColumnState({ message }) {
  return (
    <div className="border border-dashed border-slate-350 rounded-xl p-8 text-center bg-white/40">
      <ClipboardList size={24} className="mx-auto text-slate-300 mb-2" />
      <p className="text-[10px] text-slate-400 font-semibold uppercase">{message}</p>
    </div>
  );
}
