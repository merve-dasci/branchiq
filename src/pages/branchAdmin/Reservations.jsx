// React ve durum/etki kancalarını içe aktar
import React, { useEffect, useState } from 'react';
// Rezervasyon ekranı simgelerini Lucide React paketinden yükle
import { 
  Calendar, 
  Plus, 
  Search, 
  Users, 
  Clock, 
  Phone, 
  Check, 
  X, 
  Edit2, 
  Trash2, 
  AlertCircle 
} from 'lucide-react';
// Redux rezervasyon ve masa thunk eylemlerini import et
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchReservations, 
  addReservation, 
  updateReservation, 
  deleteReservation 
} from '../../features/reservations/reservationsSlice.js';
import { fetchTables, updateTable } from '../../features/tables/tablesSlice.js';
// Çoklu dil kancasını içe aktar
import { useLanguage } from '../../context/LanguageContext.jsx';
// Bildirim ve özel onay modali kancasını içe aktar
import { useNotification } from '../../context/NotificationContext.jsx';

// Rezervasyon Defteri Yönetim Sayfası
export default function Reservations({ currentUser }) {
  const dispatch = useDispatch();
  const { t, language } = useLanguage();
  const { showToast, confirm } = useNotification();
  
  // Redux store'dan rezervasyonları ve masaları oku
  const { items, loading, error } = useSelector((state) => state.reservations);
  const { items: tables } = useSelector((state) => state.tables);

  // Arama, modal ve düzenleme durum değişkenleri
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRes, setEditingRes] = useState(null);
  
  // Rezervasyon veri formu
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    guests: 2,
    tableNumber: '',
    date: '',
    time: '',
    status: 'Confirmed',
    notes: '',
    branchId: currentUser?.branchId || ''
  });

  // Sayfa yüklendiğinde verileri sunucudan çek
  useEffect(() => {
    dispatch(fetchReservations());
    dispatch(fetchTables());
  }, [dispatch]);

  // Yeni Rezervasyon Modalini Aç
  const handleOpenAddModal = () => {
    const myBranchTables = tables.filter(t => t.branchId === currentUser?.branchId);
    setEditingRes(null);
    setFormData({
      customerName: '',
      phone: '',
      guests: 2,
      tableNumber: myBranchTables[0]?.name || '',
      date: new Date().toISOString().split('T')[0],
      time: '19:00',
      status: 'Confirmed',
      notes: '',
      branchId: currentUser?.branchId || ''
    });
    setIsModalOpen(true);
  };

  // Rezervasyon Düzenleme Modalini Aç
  const handleOpenEditModal = (res) => {
    setEditingRes(res);
    setFormData({
      customerName: res.customerName,
      phone: res.phone || '',
      guests: res.guests,
      tableNumber: res.tableNumber,
      date: res.date,
      time: res.time,
      status: res.status,
      notes: res.notes || '',
      branchId: res.branchId
    });
    setIsModalOpen(true);
  };

  // Modali Kapat
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRes(null);
  };

  // Form eleman değişim takibi
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'guests' ? Number(value) : value
    }));
  };

  // Rezervasyonu Kaydet (Ekle veya Güncelle)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const myBranchTables = tables.filter(t => t.branchId === currentUser?.branchId);
    const selectedTableObj = myBranchTables.find(t => t.name === formData.tableNumber);
    
    // Masa kapasitesi kontrolü
    if (selectedTableObj && selectedTableObj.capacity < formData.guests) {
      const isConfirmed = await confirm({
        title: language === 'tr' ? 'Masa Kapasite Uyarısı' : 'Table Capacity Alert',
        message: language === 'tr' 
          ? `Uyarı: Seçilen masanın kapasitesi (${selectedTableObj.capacity}) rezervasyon kişi sayısından (${formData.guests}) küçüktür. Yine de devam etmek istiyor musunuz?`
          : `Warning: Selected table capacity (${selectedTableObj.capacity}) is less than guest count (${formData.guests}). Proceed anyway?`,
        confirmText: language === 'tr' ? 'Devam Et' : 'Proceed',
        cancelText: language === 'tr' ? 'İptal' : 'Cancel'
      });
      if (!isConfirmed) {
        return;
      }
    }

    if (editingRes) {
      dispatch(updateReservation({ id: editingRes.id, ...formData }));
      showToast(language === 'tr' ? 'Rezervasyon başarıyla güncellendi!' : 'Reservation updated successfully!', 'success');
    } else {
      dispatch(addReservation(formData));
      showToast(language === 'tr' ? 'Rezervasyon başarıyla oluşturuldu!' : 'Reservation created successfully!', 'success');
    }

    // Masa durumlarını rezervasyona göre güncelle
    if (formData.status === 'Confirmed' && selectedTableObj && selectedTableObj.status?.toLowerCase() === 'available') {
      dispatch(updateTable({ ...selectedTableObj, status: 'Reserved' }));
    } else if (formData.status === 'Arrived' && selectedTableObj && selectedTableObj.status?.toLowerCase() !== 'occupied') {
      dispatch(updateTable({ ...selectedTableObj, status: 'Occupied' }));
    }

    handleCloseModal();
  };

  // Rezervasyon İptal/Silme İşlemi
  const handleDelete = async (id) => {
    const isConfirmed = await confirm({
      title: language === 'tr' ? 'Rezervasyonu İptal Et' : 'Cancel Reservation',
      message: language === 'tr' ? 'Bu rezervasyon kaydını iptal etmek istiyor musunuz?' : 'Cancel this guest reservation?',
      confirmText: language === 'tr' ? 'İptal Et' : 'Cancel',
      cancelText: language === 'tr' ? 'Korunup Kalsın' : 'Keep'
    });
    if (isConfirmed) {
      const res = items.find(r => r.id === id);
      dispatch(deleteReservation(id));
      showToast(language === 'tr' ? 'Rezervasyon başarıyla iptal edildi!' : 'Reservation cancelled successfully!', 'success');
      if (res) {
        const matchingTable = tables.find(t => t.name === res.tableNumber && t.branchId === currentUser?.branchId);
        if (matchingTable && (matchingTable.status === 'Reserved' || matchingTable.status === 'reserved')) {
          dispatch(updateTable({ ...matchingTable, status: 'Available' }));
        }
      }
    }
  };

  // Şube bazlı filtrele
  const myBranchReservations = items.filter(r => r.branchId === currentUser?.branchId);

  // Arama sorgusuna göre filtrele
  const filteredReservations = myBranchReservations.filter(res => {
    const text = `${res.customerName} ${res.tableNumber} ${res.notes || ''}`.toLowerCase();
    return text.includes(searchQuery.toLowerCase());
  });

  return (
    <div id="reservations-panel" className="p-8 space-y-6 animate-fade-in">
      
      {/* Üst Başlık ve Rezervasyon Ekleme Butonu */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">{t('reservations_ledger')}</h2>
          <p className="text-xs text-slate-500 font-semibold">{t('manage_customer_seating')}</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4.5 py-2.5 rounded-xl cursor-pointer shadow-md transition-all duration-155"
        >
          <Plus size={14} /> {t('schedule_booking')}
        </button>
      </div>

      {/* KPI Kartları */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-2xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('confirmed_bookings')}</p>
          <h4 className="text-2xl font-black text-slate-900 mt-1">
            {myBranchReservations.filter(r => r.status === 'Confirmed').length}
          </h4>
        </div>
        <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-2xs">
          <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">{t('total_guest_covers')}</p>
          <h4 className="text-2xl font-black text-blue-600 mt-1">
            {myBranchReservations.reduce((sum, r) => sum + (r.guests || 0), 0)}
          </h4>
        </div>
        <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-2xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('avg_seating_size')}</p>
          <h4 className="text-2xl font-black text-slate-900 mt-1">
            {myBranchReservations.length > 0 
              ? (myBranchReservations.reduce((sum, r) => sum + r.guests, 0) / myBranchReservations.length).toFixed(1)
              : '0.0'} {language === 'tr' ? 'pax' : 'pax'}
          </h4>
        </div>
      </div>

      {/* Arama Girişi */}
      <div className="bg-white p-4 border border-slate-200 rounded-2xl shadow-2xs">
        <div className="relative max-w-md">
          <Search size={14} className="absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder={t('search_booking_placeholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2.5 text-xs focus:outline-hidden"
          />
        </div>
      </div>

      {/* Rezervasyon Grid Listesi */}
      {filteredReservations.length > 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="p-4">{t('customer')}</th>
                  <th className="p-4 text-center">{t('guests_count')}</th>
                  <th className="p-4 text-center">{t('seating_assignment')}</th>
                  <th className="p-4">{t('date_time')}</th>
                  <th className="p-4">{t('booking_status')}</th>
                  <th className="p-4 text-center">{t('actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {filteredReservations.map(res => {
                  const statusTranslation = res.status === 'Confirmed' ? (language === 'tr' ? 'Onaylandı' : 'Confirmed') :
                                            res.status === 'Arrived' ? (language === 'tr' ? 'Geldi / Oturdu' : 'Arrived') :
                                            (language === 'tr' ? 'İptal / Gelmedi' : 'No Show');

                  return (
                    <tr key={res.id} className="hover:bg-slate-50/50">
                      <td className="p-4 font-bold text-slate-900">
                        <div>
                          <p>{res.customerName}</p>
                          <p className="text-[10px] text-slate-400 font-medium">{res.phone || '-'}</p>
                        </div>
                      </td>
                      <td className="p-4 text-center font-extrabold text-slate-800">
                        <span className="flex items-center justify-center gap-1">
                          <Users size={12} className="text-slate-400" />
                          {res.guests}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-mono text-[10px]">
                          {language === 'tr' ? res.tableNumber.replace('Table', 'Masa') : res.tableNumber}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5 text-slate-650">
                          <Clock size={12} className="text-slate-400" />
                          <span>{res.date} • {res.time}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                          res.status === 'Confirmed' ? 'bg-blue-50 text-blue-700' :
                          res.status === 'Arrived' ? 'bg-emerald-50 text-emerald-700' :
                          'bg-slate-150 text-slate-500'
                        }`}>
                          {statusTranslation}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenEditModal(res)}
                            className="p-1 text-slate-400 hover:text-blue-600 rounded-md cursor-pointer"
                            title={t('edit') || 'Edit'}
                          >
                            <Edit2 size={12} />
                          </button>
                          <button
                            onClick={() => handleDelete(res.id)}
                            className="p-1 text-slate-400 hover:text-red-500 rounded-md cursor-pointer"
                            title={t('delete') || 'Delete'}
                          >
                            <Trash2 size={12} />
                          </button>
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
        <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center">
          <Calendar size={48} className="mx-auto text-slate-300 mb-4" />
          <h4 className="text-slate-800 font-bold">{t('no_reservations')}</h4>
          <p className="text-xs text-slate-400 mt-1">{t('no_reservations_subtitle')}</p>
        </div>
      )}

      {/* Rezervasyon Ekleme/Düzenleme Form Modali */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-zoom-in">
            <div className="px-6 py-4 bg-slate-900 text-white flex justify-between items-center">
              <h3 className="font-bold">{editingRes ? t('edit_guest_booking') : t('schedule_booking')}</h3>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-white cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-slate-600">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">{t('customer_full_name')}</label>
                <input
                  required
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-hidden font-semibold text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">{t('guests_count')}</label>
                  <input
                    required
                    type="number"
                    name="guests"
                    value={formData.guests}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-hidden font-semibold text-slate-800"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">{t('seating_assignment')}</label>
                  <select
                    name="tableNumber"
                    value={formData.tableNumber}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-hidden font-bold cursor-pointer text-slate-800"
                  >
                    {tables.filter(t => t.branchId === currentUser?.branchId).map(t => (
                      <option key={t.id} value={t.name}>
                        {language === 'tr' ? t.name.replace('Table', 'Masa') : t.name} ({t.capacity} Pax)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">{t('date_target')}</label>
                  <input
                    required
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-hidden font-semibold text-slate-800"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">{t('arrival_time_target')}</label>
                  <input
                    required
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-hidden font-semibold text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">{t('contact_phone_line')}</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+90 555 123 4567"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-hidden font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">{t('booking_status')}</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-hidden font-bold cursor-pointer text-slate-800"
                >
                  <option value="Confirmed">{language === 'tr' ? 'Onaylandı' : 'Confirmed'}</option>
                  <option value="Arrived">{language === 'tr' ? 'Geldi / Oturdu' : 'Arrived'}</option>
                  <option value="No-Show">{language === 'tr' ? 'İptal / Gelmedi' : 'No Show'}</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">{t('notes') || 'Notes'}</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="VIP, allergy alert..."
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-hidden font-semibold text-slate-800"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-slate-100 text-slate-700 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-5 py-2 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  {t('confirm_booking')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
