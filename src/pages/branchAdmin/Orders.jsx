// React ve durum kancalarını (hooks) içe aktar
import React, { useState } from 'react';
// Panel simgelerini Lucide React kütüphanesinden yükle
import { 
  ClipboardList, 
  Search, 
  CheckCircle, 
  XCircle, 
  X,
  ShoppingBag, 
  Eye, 
  UtensilsCrossed,
  Filter,
  Plus,
  Trash2
} from 'lucide-react';
// Redux store ve sipariş thunk eylemlerini yükle
import { useDispatch } from 'react-redux';
import { updateOrder, addOrder, deleteOrder } from '../../features/orders/ordersSlice.js';
// Çoklu dil kancasını içe aktar
import { useLanguage } from '../../context/LanguageContext.jsx';
// Bildirim ve özel onay modali kancasını içe aktar
import { useNotification } from '../../context/NotificationContext.jsx';

// Şube Sipariş Kayıtları Yönetim Sayfası
export default function Orders({ orders, branches, menuItems, selectedRegion, currentUser }) {
  const dispatch = useDispatch();
  const { t, language } = useLanguage();
  const { showToast, confirm } = useNotification();

  const isBranchAdmin = currentUser?.role === 'branchAdmin';
  const targetBranchId = isBranchAdmin ? (currentUser?.branchId || '') : 'All';

  // Arama, şube filtresi ve aktif sipariş kuyruk durumları
  const [selectedBranchId, setSelectedBranchId] = useState(targetBranchId);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeQueue, setActiveQueue] = useState('All');
  
  // Sipariş detayı inceleme modal referansı
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Yeni simüle sipariş ekleme modal formu durumları
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [newOrderForm, setNewOrderForm] = useState({
    branchId: '',
    customerName: '',
    type: 'Dine-In',
    items: []
  });

  // Şubeleri bölge ağı sınırlarına göre filtrele
  const regionalBranches = selectedRegion === 'All' 
    ? branches 
    : branches.filter(b => b.region === selectedRegion);

  const regionalBranchIds = regionalBranches.map(b => b.id);

  // Siparişleri seçilen filtrelere göre listele
  const filteredOrders = orders.filter(order => {
    // Bölgesel kısıt
    const matchesRegion = selectedRegion === 'All' || regionalBranchIds.includes(order.branchId);
    // Seçilen şube
    const matchesBranch = selectedBranchId === 'All' || order.branchId === selectedBranchId;
    // Mutfak durum kuyruğu
    const matchesQueue = activeQueue === 'All' || order.status === activeQueue;
    // Arama kelimesi (Kod, isim veya şube)
    const text = `${order.id} ${order.customerName} ${order.branchName}`.toLowerCase();
    const matchesSearch = text.includes(searchQuery.toLowerCase());

    return matchesRegion && matchesBranch && matchesQueue && matchesSearch;
  });

  // Duruma göre sipariş adetlerini getiren yardımcı fonksiyon
  const getQueueCount = (status) => {
    return orders.filter(o => {
      const matchesRegion = selectedRegion === 'All' || regionalBranchIds.includes(o.branchId);
      const matchesBranch = selectedBranchId === 'All' || o.branchId === selectedBranchId;
      return matchesRegion && matchesBranch && o.status === status;
    }).length;
  };

  // Toplam sipariş adetini getiren yardımcı fonksiyon
  const getTotalCount = () => {
    return orders.filter(o => {
      const matchesRegion = selectedRegion === 'All' || regionalBranchIds.includes(o.branchId);
      const matchesBranch = selectedBranchId === 'All' || o.branchId === selectedBranchId;
      return matchesRegion && matchesBranch;
    }).length;
  };

  // Sipariş mutfak aşamasını ileriye taşıma mantığı
  const handleAdvanceStatus = (order) => {
    let nextStatus = order.status;
    if (order.status === 'Pending') nextStatus = 'Preparing';
    else if (order.status === 'Preparing') nextStatus = 'Ready';
    else if (order.status === 'Ready') nextStatus = 'Completed';

    dispatch(updateOrder({
      ...order,
      status: nextStatus
    }));

    // Eğer detay modali açıksa oradaki veriyi de senkronize et
    if (selectedOrder && selectedOrder.id === order.id) {
      setSelectedOrder({ ...selectedOrder, status: nextStatus });
    }
  };

  // Siparişi iptal etme işlemi
  const handleCancelOrder = async (order) => {
    const isConfirmed = await confirm({
      title: language === 'tr' ? 'Siparişi İptal Et' : 'Cancel Order',
      message: language === 'tr' ? 'Bu siparişi iptal etmek istediğinize emin misiniz?' : 'Are you sure you want to cancel this order?',
      confirmText: language === 'tr' ? 'Siparişi İptal Et' : 'Cancel Order',
      cancelText: language === 'tr' ? 'Aktif Tut' : 'Keep Active'
    });
    if (isConfirmed) {
      dispatch(updateOrder({
        ...order,
        status: 'Cancelled'
      }));

      if (selectedOrder && selectedOrder.id === order.id) {
        setSelectedOrder({ ...selectedOrder, status: 'Cancelled' });
      }
      showToast(language === 'tr' ? 'Sipariş başarıyla iptal edildi!' : 'Order cancelled successfully!', 'success');
    }
  };

  // Sipariş kaydını tamamen silme işlemi
  const handleDeleteOrder = async (id) => {
    const isConfirmed = await confirm({
      title: language === 'tr' ? 'Sipariş Kaydını Sil' : 'Purge Order Record',
      message: language === 'tr' ? 'Bu sipariş kaydını sistem veritabanından kalıcı olarak silmek istiyor musunuz?' : 'Delete this order record permanently from the historical ledger?',
      confirmText: language === 'tr' ? 'Sil' : 'Purge',
      cancelText: language === 'tr' ? 'İptal' : 'Cancel'
    });
    if (isConfirmed) {
      dispatch(deleteOrder(id));
      setSelectedOrder(null);
      showToast(language === 'tr' ? 'Sipariş kaydı başarıyla silindi!' : 'Order record purged successfully!', 'success');
    }
  };

  // Yeni Simüle Sipariş Formunu Hazırla ve Aç
  const handleOpenNewOrderModal = () => {
    const defaultBranchId = isBranchAdmin ? (currentUser?.branchId || '') : (regionalBranches.length > 0 ? regionalBranches[0].id : '');
    setNewOrderForm({
      branchId: defaultBranchId,
      customerName: '',
      type: 'Dine-In',
      items: [{ menuItemId: menuItems[0]?.id || '', quantity: 1 }]
    });
    setIsNewOrderModalOpen(true);
  };

  // Forma yeni satır ekle
  const handleAddFormItem = () => {
    setNewOrderForm(prev => ({
      ...prev,
      items: [...prev.items, { menuItemId: menuItems[0]?.id || '', quantity: 1 }]
    }));
  };

  // Formdan satır çıkar
  const handleRemoveFormItem = (index) => {
    setNewOrderForm(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  // Form eleman değer değişim takibi
  const handleFormItemChange = (index, field, value) => {
    setNewOrderForm(prev => {
      const updated = [...prev.items];
      updated[index] = { ...updated[index], [field]: field === 'quantity' ? Number(value) : value };
      return { ...prev, items: updated };
    });
  };

  // Siparişi Veritabanına Ekle/Gönder
  const handlePlaceOrderSubmit = (e) => {
    e.preventDefault();
    const branch = branches.find(b => b.id === newOrderForm.branchId);
    if (!branch) return;

    // Seçilen ürünleri detaylandır ve maliyetlendir
    const orderItemsList = newOrderForm.items.map(formItem => {
      const originalItem = menuItems.find(m => m.id === formItem.menuItemId);
      return {
        menuItemId: formItem.menuItemId,
        name: originalItem?.name || 'Unknown item',
        quantity: formItem.quantity,
        price: originalItem?.price || 0
      };
    });

    const total = orderItemsList.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const now = new Date();

    const orderData = {
      branchId: newOrderForm.branchId,
      branchName: branch.name,
      items: orderItemsList,
      totalAmount: total,
      status: 'Pending',
      customerName: newOrderForm.customerName || (language === 'tr' ? 'Anonim Müşteri' : 'Anonymous Guest'),
      type: newOrderForm.type,
      date: now.toISOString().split('T')[0],
      time: now.toTimeString().split(' ')[0].substring(0, 5)
    };

    dispatch(addOrder(orderData));
    showToast(language === 'tr' ? 'Sipariş başarıyla oluşturuldu!' : 'Order placed successfully!', 'success');
    setIsNewOrderModalOpen(false);
  };

  return (
    <div id="orders-panel" className="p-8 space-y-6 animate-fade-in">

      {/* Sipariş Durum Sayaç Butonları */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { id: 'All', label: t('all_orders'), count: getTotalCount(), color: 'border-slate-300 text-slate-800 bg-white' },
          { id: 'Pending', label: t('pending_kitchen'), count: getQueueCount('Pending'), color: 'border-amber-300 text-amber-700 bg-amber-50/50' },
          { id: 'Preparing', label: t('preparing_food'), count: getQueueCount('Preparing'), color: 'border-blue-300 text-blue-700 bg-blue-50/50' },
          { id: 'Completed', label: t('dispatched_done'), count: getQueueCount('Completed'), color: 'border-emerald-300 text-emerald-700 bg-emerald-50/50' },
          { id: 'Cancelled', label: t('cancelled'), count: getQueueCount('Cancelled'), color: 'border-rose-300 text-rose-700 bg-rose-50/50' }
        ].map(queue => (
          <button
            key={queue.id}
            id={`queue-badge-${queue.id}`}
            onClick={() => setActiveQueue(queue.id)}
            className={`border rounded-2xl p-4 text-left transition-all cursor-pointer ${queue.color} ${
              activeQueue === queue.id 
                ? 'ring-2 ring-blue-500 shadow-md scale-102 font-bold' 
                : 'opacity-80 hover:opacity-100 shadow-xs'
            }`}
          >
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{queue.label}</p>
            <p className="text-xl font-black mt-1">{queue.count}</p>
          </button>
        ))}
      </div>

      {/* Kontrol Arama Filtre Satırı */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-white p-4 border border-slate-200 rounded-2xl shadow-xs">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search size={14} className="absolute left-3.5 top-3 text-slate-400" />
            <input
              id="order-search-input"
              type="text"
              placeholder={t('search_orders_placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {!isBranchAdmin && (
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs">
              <Filter size={12} className="text-slate-500" />
              <select
                id="order-branch-filter"
                value={selectedBranchId}
                onChange={(e) => setSelectedBranchId(e.target.value)}
                className="bg-transparent border-none font-bold text-slate-600 cursor-pointer focus:outline-hidden"
              >
                <option value="All">{t('all_branches')}</option>
                {regionalBranches.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Sipariş Ekleme Butonu */}
        <button
          id="mock-order-btn"
          onClick={handleOpenNewOrderModal}
          className="flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4.5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
        >
          <Plus size={14} />
          <span>{t('place_new_guest_order')}</span>
        </button>
      </div>

      {/* Canlı Sipariş Tablosu */}
      {filteredOrders.length > 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="p-4">{t('order_code')}</th>
                  <th className="p-4">{t('location_branch')}</th>
                  <th className="p-4">{t('customer')}</th>
                  <th className="p-4">{t('kitchen_status')}</th>
                  <th className="p-4">{t('order_type')}</th>
                  <th className="p-4 text-right">{t('total_amount')}</th>
                  <th className="p-4 text-center">{t('actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredOrders.map(order => {
                  const typeTranslation = order.type === 'Dine-In' ? (language === 'tr' ? 'Masaya Servis' : 'Dine-In') :
                                          order.type === 'Takeaway' ? (language === 'tr' ? 'Gel-Al / Paket' : 'Takeaway') :
                                          (language === 'tr' ? 'Ev Adresine Servis' : 'Delivery');

                  const statusTranslation = order.status === 'Pending' ? (language === 'tr' ? 'Sıra Bekliyor' : 'Pending') :
                                            order.status === 'Preparing' ? (language === 'tr' ? 'Hazırlanıyor' : 'Preparing') :
                                            order.status === 'Ready' ? (language === 'tr' ? 'Hazır' : 'Ready') :
                                            order.status === 'Completed' ? (language === 'tr' ? 'Teslim Edildi' : 'Completed') :
                                            order.status === 'Cancelled' ? (language === 'tr' ? 'İptal Edildi' : 'Cancelled') :
                                            order.status;

                  return (
                    <tr key={order.id} id={`order-row-${order.id}`} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 font-mono font-bold text-slate-900">{order.id}</td>
                      <td className="p-4 font-semibold text-slate-800">{order.branchName}</td>
                      <td className="p-4">
                        <div>
                          <p className="font-semibold text-slate-700">{order.customerName}</p>
                          <p className="text-[10px] text-slate-400 font-medium">{order.date} • {order.time}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider ${
                          order.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                          order.status === 'Preparing' ? 'bg-blue-100 text-blue-700' :
                          order.status === 'Ready' ? 'bg-teal-100 text-teal-700' :
                          order.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                          order.status === 'Cancelled' ? 'bg-rose-100 text-rose-700' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {statusTranslation}
                        </span>
                      </td>
                      <td className="p-4 font-semibold text-slate-600">{typeTranslation}</td>
                      <td className="p-4 text-right font-black text-slate-900">${order.totalAmount}</td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          {/* Detayları Gör */}
                          <button
                            id={`order-view-btn-${order.id}`}
                            onClick={() => setSelectedOrder(order)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100 cursor-pointer"
                            title={t('inspect_order_items')}
                          >
                            <Eye size={14} />
                          </button>

                          {/* Durumu İlerlet */}
                          {order.status !== 'Completed' && order.status !== 'Cancelled' && (
                            <button
                              id={`order-advance-btn-${order.id}`}
                              onClick={() => handleAdvanceStatus(order)}
                              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-2.5 py-1 rounded-lg text-[10px] cursor-pointer"
                            >
                              {order.status === 'Pending' ? t('start_cooking') : t('dispatch')}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center shadow-xs">
          <ClipboardList size={48} className="mx-auto text-slate-300 mb-4" />
          <h4 className="text-slate-800 font-bold">{t('no_orders_in_queue')}</h4>
          <p className="text-xs text-slate-400 mt-1">{t('operational_queues_clear')}</p>
        </div>
      )}

      {/* Sipariş Detay İnceleme Modali */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 bg-slate-900 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <ShoppingBag size={18} className="text-blue-400" />
                <h3 className="font-bold">{t('order_details_title')} {selectedOrder.id}</h3>
              </div>
              <button 
                id="close-order-detail-btn"
                onClick={() => setSelectedOrder(null)} 
                className="text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Bilgi Kutusu */}
              <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl">
                <div>
                  <p className="text-slate-400 font-semibold mb-0.5 uppercase text-[9px]">{t('location_branch')}</p>
                  <p className="font-bold text-slate-800">{selectedOrder.branchName}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-semibold mb-0.5 uppercase text-[9px]">{t('kitchen_status')}</p>
                  <span className={`inline-block px-2 py-0.5 rounded-full font-extrabold text-[10px] uppercase ${
                    selectedOrder.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                    selectedOrder.status === 'Preparing' ? 'bg-blue-100 text-blue-700' :
                    selectedOrder.status === 'Ready' ? 'bg-teal-100 text-teal-700' :
                    selectedOrder.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                    selectedOrder.status === 'Cancelled' ? 'bg-rose-100 text-rose-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {selectedOrder.status === 'Pending' ? (language === 'tr' ? 'Bekliyor' : 'Pending') :
                     selectedOrder.status === 'Preparing' ? (language === 'tr' ? 'Hazırlanıyor' : 'Preparing') :
                     selectedOrder.status === 'Ready' ? (language === 'tr' ? 'Hazır' : 'Ready') :
                     selectedOrder.status === 'Completed' ? (language === 'tr' ? 'Tamamlandı' : 'Completed') :
                     selectedOrder.status === 'Cancelled' ? (language === 'tr' ? 'İptal' : 'Cancelled') :
                     selectedOrder.status}
                  </span>
                </div>
                <div>
                  <p className="text-slate-400 font-semibold mb-0.5 uppercase text-[9px]">{t('customer')}</p>
                  <p className="font-bold text-slate-800">{selectedOrder.customerName}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-semibold mb-0.5 uppercase text-[9px]">{t('order_type')}</p>
                  <p className="font-bold text-slate-800">{selectedOrder.type === 'Dine-In' ? (language === 'tr' ? 'Masaya Servis' : 'Dine-In') : selectedOrder.type}</p>
                </div>
              </div>

              {/* Sipariş Edilen Yemekler */}
              <div className="space-y-3">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{t('ordered_culinary_items')}</h4>
                <div className="space-y-2 border-y border-slate-100 py-3">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-xs font-semibold text-slate-700">
                      <span>{item.name} <span className="text-blue-500">x{item.quantity}</span></span>
                      <span>${item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-sm font-black text-slate-900 pt-1">
                  <span>{t('grand_total')}</span>
                  <span>${selectedOrder.totalAmount}</span>
                </div>
              </div>

              {/* Modaldaki Sipariş Aşaması İlerletme İşlemleri */}
              <div className="flex flex-col gap-2 pt-4 border-t border-slate-100">
                {selectedOrder.status !== 'Completed' && selectedOrder.status !== 'Cancelled' && (
                  <button
                    id="modal-advance-order-btn"
                    onClick={() => handleAdvanceStatus(selectedOrder)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CheckCircle size={14} />
                    <span>
                      {selectedOrder.status === 'Pending' ? t('advance_to_cooking') : t('advance_to_dispatched')}
                    </span>
                  </button>
                )}

                {selectedOrder.status !== 'Completed' && selectedOrder.status !== 'Cancelled' && (
                  <button
                    id="modal-cancel-order-btn"
                    onClick={() => handleCancelOrder(selectedOrder)}
                    className="w-full bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <XCircle size={14} />
                    <span>{t('cancel_this_order')}</span>
                  </button>
                )}

                {currentUser && currentUser.role === 'Super Admin' && (
                  <button
                    id="modal-delete-order-btn"
                    onClick={() => handleDeleteOrder(selectedOrder.id)}
                    className="w-full bg-transparent hover:bg-red-50 text-red-500 hover:text-red-700 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Trash2 size={14} />
                    <span>{t('purge_transaction_record')}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Yeni Simüle Sipariş Ekleme Modali */}
      {isNewOrderModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-zoom-in">
            <div className="px-6 py-4 bg-slate-900 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <UtensilsCrossed size={18} className="text-blue-400" />
                <h3 className="font-bold">{t('place_guest_mock_order')}</h3>
              </div>
              <button 
                id="close-mock-order-modal-btn"
                onClick={() => setIsNewOrderModalOpen(false)} 
                className="text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handlePlaceOrderSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">{t('target_branch')}</label>
                  {isBranchAdmin ? (
                    <input
                      disabled
                      type="text"
                      value={branches.find(b => b.id === currentUser?.branchId)?.name || ''}
                      className="w-full bg-slate-100 border border-slate-200 text-slate-500 rounded-xl px-3.5 py-2 text-xs focus:outline-hidden font-bold cursor-not-allowed"
                    />
                  ) : (
                    <select
                      required
                      value={newOrderForm.branchId}
                      onChange={(e) => setNewOrderForm(prev => ({ ...prev, branchId: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2 text-xs focus:outline-hidden cursor-pointer font-bold"
                    >
                      {regionalBranches.map(b => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">{t('service_type')}</label>
                  <select
                    required
                    value={newOrderForm.type}
                    onChange={(e) => setNewOrderForm(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2 text-xs focus:outline-hidden cursor-pointer"
                  >
                    <option value="Dine-In">{language === 'tr' ? 'Masaya Servis' : 'Dine-In'}</option>
                    <option value="Takeaway">{language === 'tr' ? 'Gel-Al' : 'Takeaway'}</option>
                    <option value="Delivery">{language === 'tr' ? 'Adrese Teslim' : 'Delivery'}</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">{t('customer')}</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. David Hasselhoff"
                    value={newOrderForm.customerName}
                    onChange={(e) => setNewOrderForm(prev => ({ ...prev, customerName: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2 text-sm focus:outline-hidden"
                  />
                </div>

                {/* Ürün Ekleme/Çıkarma Alt Bölümü */}
                <div className="col-span-2 space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">{t('dish_quantity_selector')}</label>
                    <button
                      type="button"
                      onClick={handleAddFormItem}
                      className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Plus size={12} /> {t('add_item')}
                    </button>
                  </div>

                  {newOrderForm.items.map((item, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <select
                        value={item.menuItemId}
                        onChange={(e) => handleFormItemChange(idx, 'menuItemId', e.target.value)}
                        className="flex-1 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2 text-xs focus:outline-hidden cursor-pointer"
                      >
                        {menuItems.map(m => (
                          <option key={m.id} value={m.id}>{m.name} (${m.price})</option>
                        ))}
                      </select>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={item.quantity}
                        onChange={(e) => handleFormItemChange(idx, 'quantity', e.target.value)}
                        className="w-16 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2 text-xs text-center focus:outline-hidden"
                      />
                      {newOrderForm.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveFormItem(idx)}
                          className="p-2 text-slate-400 hover:text-red-500 cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

              </div>

              {/* Form Alt Butonları */}
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewOrderModalOpen(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm px-4 py-2.5 rounded-xl transition-all cursor-pointer"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  id="submit-mock-order-form-btn"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-all cursor-pointer"
                >
                  {t('dispatch_to_kitchen')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
