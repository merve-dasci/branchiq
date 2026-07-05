// React ve durum/etki kancalarını içe aktar
import React, { useEffect, useState } from 'react';
// Panel simgelerini Lucide React kütüphanesinden yükle
import { 
  Calendar, 
  Plus, 
  Search, 
  Trash2, 
  Clock, 
  User, 
  Users, 
  Check, 
  X,
  Edit2
} from 'lucide-react';
// Redux rezervasyon ve masa güncelleme thunk'larını yükle
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

// Rezervasyon Defteri Yönetim Sayfası
export default function Reservations({ currentUser }) {
  const dispatch = useDispatch();
  const { t, language } = useLanguage();
  
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
    guests: 2,
    date: '2026-07-03',
    time: '19:00',
    tableNumber: '',
    phone: '',
    status: 'Confirmed'
  });

  // Sayfa yüklendiğinde rezervasyonları ve masaları sunucudan getir
  useEffect(() => {
    dispatch(fetchReservations());
    dispatch(dispatch => {
      dispatch(fetchTables());
    });
  }, [dispatch]);

  // Yeni Rezervasyon Ekleme Modalini Aç
  const handleOpenAddModal = () => {
    const myBranchTables = tables.filter(t => t.branchId === currentUser?.branchId);
    const defaultTable = myBranchTables.length > 0 ? myBranchTables[0].name : '';
    setEditingRes(null);
    setFormData({
      customerName: '',
      guests: 2,
      date: new Date().toISOString().split('T')[0],
      time: '19:00',
      tableNumber: defaultTable,
      phone: '',
      status: 'Confirmed'
    });
    setIsModalOpen(true);
  };

  // Rezervasyon Düzenleme Modalini Aç
  const handleOpenEditModal = (res) => {
    const myBranchTables = tables.filter(t => t.branchId === currentUser?.branchId);
    const defaultTable = myBranchTables.length > 0 ? myBranchTables[0].name : '';
    setEditingRes(res);
    setFormData({
      customerName: res.customerName,
      guests: res.guests,
      date: res.date,
      time: res.time,
      tableNumber: res.tableNumber || defaultTable,
      phone: res.phone || '',
      status: res.status || 'Confirmed'
    });
    setIsModalOpen(true);
  };

  // Modali Kapat
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRes(null);
  };

  // Form Veri Değişimlerini İzle
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'guests' ? Number(value) : value
    }));
  };

  // Rezervasyon Formunu Gönder
  const handleSubmit = (e) => {
    e.preventDefault();
    const myBranchTables = tables.filter(t => t.branchId === currentUser?.branchId);
    const selectedTableObj = myBranchTables.find(t => t.name === formData.tableNumber);
    
    // Masa kapasitesi kontrolü
    if (selectedTableObj && selectedTableObj.capacity < formData.guests) {
      if (!window.confirm(
        language === 'tr' 
          ? `Uyarı: Seçilen masanın kapasitesi (${selectedTableObj.capacity}) rezervasyon kişi sayısından (${formData.guests}) küçüktür. Yine de devam etmek istiyor musunuz?`
          : `Warning: Selected table capacity (${selectedTableObj.capacity}) is less than guest count (${formData.guests}). Proceed anyway?`
      )) {
        return;
      }
    }

    if (editingRes) {
      dispatch(updateReservation({ id: editingRes.id, ...formData }));
    } else {
      dispatch(addReservation(formData));
    }

    // Masa durumlarını rezervasyona göre güncelle
    if (formData.status === 'Confirmed' && selectedTableObj && selectedTableObj.status === 'available') {
      dispatch(updateTable({ ...selectedTableObj, status: 'reserved' }));
    } else if (formData.status === 'Arrived' && selectedTableObj && selectedTableObj.status !== 'occupied') {
      dispatch(updateTable({ ...selectedTableObj, status: 'occupied' }));
    }

    handleCloseModal();
  };

  // Rezervasyon İptal/Silme İşlemi
  const handleDelete = (id) => {
    if (window.confirm(language === 'tr' ? 'Bu rezervasyon kaydını iptal etmek istiyor musunuz?' : 'Cancel this guest reservation?')) {
      const res = items.find(r => r.id === id);
      dispatch(deleteReservation(id));
      if (res) {
        const matchingTable = tables.find(t => t.name === res.tableNumber && t.branchId === currentUser?.branchId);
        if (matchingTable && matchingTable.status === 'reserved') {
          dispatch(updateTable({ ...matchingTable, status: 'available' }));
        }
      }
    }
  };

  // Rezervasyon Durumunu Hızlı Değiştir (Müşteri Geldi vb.)
  const handleStatusChange = (res, newStatus) => {
    dispatch(updateReservation({ ...res, status: newStatus }));
    
    const matchingTable = tables.find(t => t.name === res.tableNumber && t.branchId === currentUser?.branchId);
    if (newStatus === 'Arrived' && matchingTable) {
      dispatch(updateTable({ ...matchingTable, status: 'occupied' }));
    } else if (newStatus === 'Cancelled' && matchingTable && matchingTable.status === 'reserved') {
      dispatch(updateTable({ ...matchingTable, status: 'available' }));
    }
  };

  // Arama metnine göre filtrele
  const filteredReservations = items.filter(res => {
    return res.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
           res.tableNumber?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div id="reservations-panel" className="p-8 space-y-6 animate-fade-in">
      
      {/* Üst Başlık ve Rezervasyon Ekle Butonu */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">{t('reservations_book')}</h2>
          <p className="text-xs text-slate-550 font-semibold font-sans">{t('manage_customer_seating')}</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4.5 py-2.5 rounded-xl cursor-pointer shadow-md transition-all duration-155"
        >
          <Plus size={14} /> {t('schedule_booking')}
        </button>
      </div>

      {/* Rezervasyon Sayaç Panel Kartları */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-2xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('confirmed_bookings')}</p>
          <h4 className="text-2xl font-black text-slate-900 mt-1">
            {items.filter(r => r.status === 'Confirmed' || r.status === 'Arrived').length}
          </h4>
        </div>
        <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-2xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('total_guest_covers')}</p>
          <h4 className="text-2xl font-black text-blue-600 mt-1">
            {items.reduce((sum, r) => sum + (r.guests || 0), 0)}
          </h4>
        </div>
        <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-2xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('avg_seating_size')}</p>
          <h4 className="text-2xl font-black text-slate-900 mt-1">
            {items.length > 0 ? (items.reduce((sum, r) => sum + (r.guests || 0), 0) / items.length).toFixed(1) : 0} {language === 'tr' ? 'kişi' : 'pax'}
          </h4>
        </div>
      </div>

      {/* Arama Girişi */}
      <div className="flex gap-4 items-center bg-white p-4 border border-slate-200 rounded-2xl shadow-2xs">
        <div className="relative w-64">
          <Search size={14} className="absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder={t('search_booking_placeholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2.5 text-xs focus:outline-hidden"
          />
        </div>
      </div>

      {/* Ana Rezervasyon Listesi Tablosu */}
      {filteredReservations.length > 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="p-4">{t('customer_name')}</th>
                  <th className="p-4">{t('guests_count')}</th>
                  <th className="p-4">{t('date_time')}</th>
                  <th className="p-4">{t('assigned_table')}</th>
                  <th className="p-4">{t('phone')}</th>
                  <th className="p-4">{t('status')}</th>
                  <th className="p-4 text-center">{t('actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {filteredReservations.map(res => {
                  const statusTranslation = res.status === 'Confirmed' ? (language === 'tr' ? 'Onaylandı' : 'Confirmed') :
                                            res.status === 'Arrived' ? (language === 'tr' ? 'Geldi' : 'Arrived') :
                                            (language === 'tr' ? 'İptal' : 'Cancelled');

                  return (
                    <tr key={res.id} className="hover:bg-slate-50/50">
                      <td className="p-4 font-bold text-slate-900 flex items-center gap-2">
                        <User size={13} className="text-slate-400" />
                        <span>{res.customerName}</span>
                      </td>
                      <td className="p-4 text-slate-800">
                        <span className="flex items-center gap-1">
                          <Users size={12} className="text-slate-400" />
                          <span>{res.guests} {language === 'tr' ? 'kişi' : 'pax'}</span>
                        </span>
                      </td>
                      <td className="p-4 text-slate-600">
                        <span className="flex items-center gap-1">
                          <Clock size={12} className="text-slate-400" />
                          <span>{res.date} • {res.time}</span>
                        </span>
                      </td>
                      <td className="p-4 font-extrabold text-blue-600">
                        {language === 'tr' ? res.tableNumber.replace('Table', 'Masa') : res.tableNumber}
                      </td>
                      <td className="p-4 font-medium text-slate-555">{res.phone || t('no_phone_set')}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded-md ${
                          res.status === 'Arrived' ? 'bg-emerald-50 text-emerald-700' :
                          res.status === 'Cancelled' ? 'bg-rose-50 text-rose-700' : 'bg-blue-50 text-blue-700'
                        }`}>
                          {statusTranslation}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {res.status !== 'Arrived' && res.status !== 'Cancelled' && (
                            <>
                              <button
                                onClick={() => handleStatusChange(res, 'Arrived')}
                                className="p-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg cursor-pointer"
                                title={language === 'tr' ? 'Geldi Olarak İşaretle' : 'Arrived'}
                              >
                                <Check size={12} />
                              </button>
                              <button
                                onClick={() => handleStatusChange(res, 'Cancelled')}
                                className="p-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg cursor-pointer"
                                title={language === 'tr' ? 'İptal Et' : 'Cancel'}
                              >
                                <X size={12} />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleOpenEditModal(res)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-50 rounded-lg cursor-pointer"
                            title={t('edit') || 'Edit'}
                          >
                            <Edit2 size={12} />
                          </button>
                          <button
                            onClick={() => handleDelete(res.id)}
                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-slate-50 rounded-lg cursor-pointer"
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
              <h3 className="font-bold">{editingRes ? t('edit_guest_booking') : t('add_booking')}</h3>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-white cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">{t('customer_full_name')}</label>
                <input
                  required
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-hidden font-semibold"
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
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-hidden font-semibold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">{t('seating_assignment')}</label>
                  <select
                    required
                    name="tableNumber"
                    value={formData.tableNumber}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-hidden font-semibold font-bold cursor-pointer text-slate-800"
                  >
                    <option value="">{t('select_a_table')}</option>
                    {tables.filter(t => t.branchId === currentUser?.branchId).map(t => (
                      <option key={t.id} value={t.name}>
                        {(language === 'tr' ? t.name.replace('Table', 'Masa') : t.name)} ({t.capacity} {language === 'tr' ? 'Kişilik' : 'seats'}) - {t.status}
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
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-hidden font-semibold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">{t('arrival_time_target')}</label>
                  <input
                    required
                    type="text"
                    name="time"
                    placeholder="e.g. 19:30"
                    value={formData.time}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-hidden font-semibold"
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-hidden font-semibold"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">{t('booking_status')}</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-hidden font-bold cursor-pointer"
                >
                  <option value="Confirmed">{language === 'tr' ? 'Onaylandı' : 'Confirmed'}</option>
                  <option value="Arrived">{language === 'tr' ? 'Geldi' : 'Arrived'}</option>
                  <option value="Cancelled">{language === 'tr' ? 'İptal Edildi' : 'Cancelled'}</option>
                </select>
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
