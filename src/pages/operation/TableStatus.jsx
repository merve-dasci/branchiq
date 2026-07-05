// React ve etki kancasını (useEffect) içe aktar
import React, { useEffect } from 'react';
// Salon operasyonu simgelerini Lucide React paketinden yükle
import { 
  Layers, 
  Users, 
  CheckCircle, 
  Activity, 
  ClipboardList,
  RefreshCw,
  Clock
} from 'lucide-react';
// Redux bağlantısı ve veri güncelleme eylemlerini yükle
import { useDispatch, useSelector } from 'react-redux';
import { fetchTables, updateTable } from '../../features/tables/tablesSlice.js';
import { fetchOrders } from '../../features/orders/ordersSlice.js';
// Çoklu dil kancasını içe aktar
import { useLanguage } from '../../context/LanguageContext.jsx';

// Operasyon Admin Masa Canlı Doluluk/Sipariş Durumu
export default function TableStatus({ currentUser }) {
  const dispatch = useDispatch();
  const { t, language } = useLanguage();
  // Redux store'dan masaları ve siparişleri çek
  const { items: tables, loading: tablesLoading } = useSelector((state) => state.tables);
  const { items: orders, loading: ordersLoading } = useSelector((state) => state.orders);

  // Sayfa açıldığında masaları ve siparişleri sunucudan getir
  useEffect(() => {
    dispatch(fetchTables());
    dispatch(fetchOrders());
  }, [dispatch]);

  // Aktif kullanıcının şube ID'sini al
  const targetBranchId = currentUser?.branchId || '';

  // Masaları şubeye göre filtrele
  const branchTables = tables.filter(t => t.branchId === targetBranchId);

  // Siparişleri şubeye göre filtrele
  const branchOrders = orders.filter(o => o.branchId === targetBranchId);

  // Masanın doluluk durumunu değiştir (Boş, Dolu, Rezervli, Temizleniyor)
  const handleStatusChange = (table, newStatus) => {
    dispatch(updateTable({ ...table, status: newStatus }));
  };

  // Duruma göre CSS renk sınıfı döndüren yardımcı metot
  const getStatusBadgeClass = (status) => {
    const s = status?.toLowerCase();
    if (s === 'occupied') return 'bg-rose-50 border-rose-100 text-rose-700';
    if (s === 'reserved') return 'bg-amber-50 border-amber-100 text-amber-700';
    if (s === 'cleaning') return 'bg-blue-50 border-blue-100 text-blue-700';
    return 'bg-emerald-50 border-emerald-100 text-emerald-700';
  };

  return (
    <div id="table-status-panel" className="p-8 space-y-6 animate-fade-in">
      
      {/* Üst Başlık Bilgisi */}
      <div className="flex justify-between items-center">
        <div>
          <span className="bg-blue-600 text-[10px] uppercase font-black tracking-widest px-2.5 py-1 rounded-md text-white">{t('floor_ops')}</span>
          <h2 className="text-xl font-black text-slate-900 tracking-tight mt-2.5">{t('live_table_console')}</h2>
          <p className="text-xs text-slate-500 font-semibold font-sans">{t('monitor_seating_capacity')}</p>
        </div>
      </div>

      {/* Masa Durum Sayaç Kartları */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        {/* Toplam Masa */}
        <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('total_seating_slots')}</p>
          <h4 className="text-2xl font-black text-slate-900 mt-1">{branchTables.length}</h4>
        </div>
        {/* Boş / Müsait Masalar */}
        <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-xs">
          <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">{t('available_tables')}</p>
          <h4 className="text-2xl font-black text-emerald-600 mt-1">
            {branchTables.filter(t => t.status?.toLowerCase() === 'available').length}
          </h4>
        </div>
        {/* Dolu Masalar */}
        <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-xs">
          <p className="text-[10px] font-bold text-rose-500 uppercase tracking-wider">{t('occupied_tables')}</p>
          <h4 className="text-2xl font-black text-rose-600 mt-1">
            {branchTables.filter(t => t.status?.toLowerCase() === 'occupied').length}
          </h4>
        </div>
        {/* Temizlenmekte Olan Masalar */}
        <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-xs">
          <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">{t('tables_in_cleaning')}</p>
          <h4 className="text-2xl font-black text-blue-600 mt-1">
            {branchTables.filter(t => t.status?.toLowerCase() === 'cleaning').length}
          </h4>
        </div>
      </div>

      {/* Masaların Görsel Kart Listesi */}
      {branchTables.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {branchTables.map(table => {
            const isOccupied = table.status?.toLowerCase() === 'occupied';
            const tableStatusTranslation = table.status === 'Available' ? (language === 'tr' ? 'Boş / Müsait' : 'Available') :
                                           table.status === 'Occupied' ? (language === 'tr' ? 'Dolu' : 'Occupied') :
                                           table.status === 'Reserved' ? (language === 'tr' ? 'Rezervli' : 'Reserved') :
                                           (language === 'tr' ? 'Temizlikte' : 'Cleaning');
            
            // Masaya atanan aktif siparişi bul
            const activeOrder = branchOrders.find(o => 
              o.status?.toLowerCase() !== 'completed' && 
              o.status?.toLowerCase() !== 'cancelled' && 
              (o.tableNumber === table.name || o.id === table.currentOrderId)
            );

            return (
              <div 
                key={table.id}
                className="p-5 rounded-2xl border transition-all flex flex-col justify-between min-h-[220px] bg-white border-slate-200 hover:border-slate-350 hover:shadow-md"
              >
                {/* Masa Başlık ve Durum Badge */}
                <div className="flex justify-between items-start border-b border-slate-100 pb-2.5">
                  <div>
                    <h4 className="text-sm font-black text-slate-900">{language === 'tr' ? table.name.replace('Table', 'Masa') : table.name}</h4>
                    <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">{table.section === 'Main Hall' ? t('main_hall') : (table.section || t('main_hall'))}</p>
                  </div>
                  <span className={`px-2 py-0.5 border rounded-md text-[9px] font-black uppercase ${getStatusBadgeClass(table.status)}`}>
                    {tableStatusTranslation}
                  </span>
                </div>

                {/* Masa Kapasite ve Sipariş Detayları */}
                <div className="py-3 flex-1 flex flex-col justify-center gap-2">
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 font-bold">
                    <Users size={13} className="text-slate-400" />
                    <span>{t('capacity')}: {table.capacity} Kişi</span>
                  </div>

                  {/* Masa doluysa aktif siparişi göster */}
                  {isOccupied && (
                    <div className="bg-rose-50/40 border border-rose-100 rounded-xl p-2.5 text-[10px] space-y-1">
                      <span className="font-extrabold text-rose-700 uppercase text-[8px] tracking-wider block">{language === 'tr' ? 'Aktif Sipariş Detayları:' : 'Active Order Details:'}</span>
                      {activeOrder ? (
                        <>
                          <div className="flex justify-between font-bold text-slate-700">
                            <span className="truncate max-w-[120px]">{activeOrder.id}</span>
                            <span className="text-rose-600">${activeOrder.totalAmount}</span>
                          </div>
                          <p className="text-slate-500 font-medium truncate">{language === 'tr' ? 'Müşteri' : 'Guest'}: {activeOrder.customerName}</p>
                          <div className="flex items-center gap-1 text-[9px] text-slate-400">
                            <Clock size={10} />
                            <span>{language === 'tr' ? 'Durum' : 'Status'}: {activeOrder.status === 'Pending' ? t('pending') : t('preparing')}</span>
                          </div>
                        </>
                      ) : (
                        <p className="text-slate-400 font-medium italic">{language === 'tr' ? 'Aktif sipariş bulunamadı.' : 'No active order linked.'}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Hızlı Durum Değiştirme Seçicisi */}
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <label className="text-[8px] font-extrabold text-slate-400 uppercase tracking-widest block">{t('change_status')}</label>
                  <select
                    value={table.status?.toLowerCase() || 'available'}
                    onChange={(e) => handleStatusChange(table, e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-2.5 py-1.5 text-[10px] font-black focus:outline-hidden cursor-pointer"
                  >
                    <option value="available">🟢 {language === 'tr' ? 'Boş / Müsait' : 'Available'}</option>
                    <option value="occupied">🔴 {language === 'tr' ? 'Dolu' : 'Occupied'}</option>
                    <option value="reserved">🟡 {language === 'tr' ? 'Rezervli' : 'Reserved'}</option>
                    <option value="cleaning">🔵 {language === 'tr' ? 'Temizlikte' : 'Cleaning'}</option>
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        // Masa Bulunamazsa Gösterilecek Boş Şablon
        <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center shadow-xs">
          <Layers size={48} className="mx-auto text-slate-300 mb-4" />
          <h4 className="text-slate-800 font-bold">{language === 'tr' ? 'Konfigüre Edilmiş Masa Bulunamadı' : 'No Seating Slots Found'}</h4>
          <p className="text-xs text-slate-400 mt-1">{language === 'tr' ? 'Bu şube için henüz tanımlanmış masa bulunmuyor.' : 'There are no table slots configured for this branch.'}</p>
        </div>
      )}
    </div>
  );
}
