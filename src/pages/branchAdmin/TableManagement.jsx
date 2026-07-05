// React ve etki kancalarını (useEffect, useState) içe aktar
import React, { useEffect, useState } from 'react';
// Salon yerleşim simgelerini Lucide React paketinden yükle
import { 
  Layers, 
  Plus, 
  Trash2, 
  Users, 
  Edit2, 
  X
} from 'lucide-react';
// Redux masa yükleme, ekleme ve güncelleme eylemlerini import et
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchTables, 
  addTable, 
  updateTable, 
  deleteTable 
} from '../../features/tables/tablesSlice.js';
// Çoklu dil kancasını içe aktar
import { useLanguage } from '../../context/LanguageContext.jsx';
// Bildirim ve özel onay modali kancasını içe aktar
import { useNotification } from '../../context/NotificationContext.jsx';

// Şube Yöneticisi Masa Yerleşimi Yönetim Sayfası
export default function TableManagement({ currentUser }) {
  const dispatch = useDispatch();
  const { t, language } = useLanguage();
  const { showToast, confirm } = useNotification();
  // Redux store'dan masaları al
  const { items, loading, error } = useSelector((state) => state.tables);

  // Modal ve düzenleme durum değişkenleri
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  
  // Masa bilgi formu veri yapısı
  const [formData, setFormData] = useState({
    name: 'Table 1',
    capacity: 4,
    status: 'Available',
    section: 'Main Hall'
  });

  // Sayfa açıldığında masaları sunucudan çek
  useEffect(() => {
    dispatch(fetchTables());
  }, [dispatch]);

  // Yeni Masa Ekleme Modalini Aç
  const handleOpenAddModal = () => {
    setEditingTable(null);
    setFormData({
      name: (language === 'tr' ? 'Masa ' : 'Table ') + (items.length + 1),
      capacity: 4,
      status: 'Available',
      section: 'Main Hall'
    });
    setIsModalOpen(true);
  };

  // Masa Düzenleme Modalini Aç
  const handleOpenEditModal = (table) => {
    setEditingTable(table);
    setFormData({
      name: table.name,
      capacity: table.capacity,
      status: table.status,
      section: table.section || 'Main Hall'
    });
    setIsModalOpen(true);
  };

  // Modali Kapat
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTable(null);
  };

  // Form Değişimlerini İzle
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'capacity' ? Number(value) : value
    }));
  };

  // Masa Formunu Kaydet/Gönder
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingTable) {
      dispatch(updateTable({ id: editingTable.id, ...formData }));
      showToast(language === 'tr' ? 'Masa başarıyla güncellendi!' : 'Table updated successfully!', 'success');
    } else {
      dispatch(addTable(formData));
      showToast(language === 'tr' ? 'Masa başarıyla eklendi!' : 'Table added successfully!', 'success');
    }
    handleCloseModal();
  };

  // Masayı Salon Düzeninden Kaldır
  const handleDelete = async (id) => {
    const isConfirmed = await confirm({
      title: language === 'tr' ? 'Masayı Kaldır' : 'Remove Table',
      message: language === 'tr' ? 'Bu masa konfigürasyonunu salon düzeninden kaldırmak istiyor musunuz?' : 'Remove this table layout configuration?',
      confirmText: language === 'tr' ? 'Masayı Kaldır' : 'Remove',
      cancelText: language === 'tr' ? 'İptal' : 'Cancel'
    });
    if (isConfirmed) {
      dispatch(deleteTable(id));
      showToast(language === 'tr' ? 'Masa düzeninden başarıyla kaldırıldı!' : 'Table removed successfully!', 'success');
    }
  };

  // Masa Doluluk Durumunu Hızlı Değiştir (Boş / Dolu)
  const handleStatusToggle = (table) => {
    const nextStatus = table.status === 'Available' ? 'Occupied' : 'Available';
    dispatch(updateTable({ ...table, status: nextStatus }));
  };

  // Şube bazlı masaları filtrele
  const myBranchTables = items.filter(t => t.branchId === currentUser?.branchId || !t.branchId);

  return (
    <div id="table-management-panel" className="p-8 space-y-6 animate-fade-in">
      
      {/* Üst Başlık ve Masa Ekleme Butonu */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">{t('seating_layout')}</h2>
          <p className="text-xs text-slate-500 font-semibold">{t('track_occupancy_limits')}</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4.5 py-2.5 rounded-xl cursor-pointer shadow-md transition-all duration-155"
        >
          <Plus size={14} /> {t('add_table_slot')}
        </button>
      </div>

      {/* Masa Kapasite Sayaç Kartları */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-2xl-xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('total_seating_slots')}</p>
          <h4 className="text-2xl font-black text-slate-900 mt-1">{myBranchTables.length}</h4>
        </div>
        <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-2xl-xs">
          <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">{t('available_tables')}</p>
          <h4 className="text-2xl font-black text-emerald-600 mt-1">
            {myBranchTables.filter(t => t.status === 'Available').length}
          </h4>
        </div>
        <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-2xl-xs">
          <p className="text-[10px] font-bold text-rose-500 uppercase tracking-wider">{t('occupied_tables')}</p>
          <h4 className="text-2xl font-black text-rose-600 mt-1">
            {myBranchTables.filter(t => t.status === 'Occupied').length}
          </h4>
        </div>
        <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-2xl-xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('consolidated_seating_cap')}</p>
          <h4 className="text-2xl font-black text-slate-900 mt-1">
            {myBranchTables.reduce((sum, t) => sum + (t.capacity || 0), 0)} {language === 'tr' ? 'koltuk' : 'seats'}
          </h4>
        </div>
      </div>

      {/* Masaların Bento Grid Düzeni */}
      {myBranchTables.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {myBranchTables.map(table => {
            const isOccupied = table.status === 'Occupied';
            const sectionTranslation = table.section === 'Main Hall' ? (language === 'tr' ? 'Ana Salon' : 'Main Hall') :
                                       table.section === 'Garden Patio' ? (language === 'tr' ? 'Bahçe / Veranda' : 'Garden Patio') :
                                       table.section === 'VIP Saloon' ? (language === 'tr' ? 'VIP Salon' : 'VIP Saloon') :
                                       table.section === 'Bar Desk' ? (language === 'tr' ? 'Bar / Tezgah' : 'Bar Desk') : (table.section || 'Main');

            return (
              <div 
                key={table.id}
                className={`p-5 rounded-2xl border transition-all relative flex flex-col justify-between h-40 ${
                  isOccupied 
                    ? 'bg-rose-50/30 border-rose-200 shadow-rose-100/10' 
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Kontrol Butonları ve Masa Etiketi */}
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-black text-slate-900">{language === 'tr' ? table.name.replace('Table', 'Masa') : table.name}</h4>
                    <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">{sectionTranslation}</p>
                  </div>
                  
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleOpenEditModal(table)}
                      className="p-1 text-slate-400 hover:text-blue-600 hover:bg-slate-50 rounded-md cursor-pointer"
                      title={t('edit') || 'Edit'}
                    >
                      <Edit2 size={10} />
                    </button>
                    <button
                      onClick={() => handleDelete(table.id)}
                      className="p-1 text-slate-400 hover:text-red-500 hover:bg-slate-50 rounded-md cursor-pointer"
                      title={t('delete') || 'Delete'}
                    >
                      <Trash2 size={10} />
                    </button>
                  </div>
                </div>

                {/* Masa Kişi Kapasitesi */}
                <div className="flex items-center gap-1.5 py-3">
                  <Users size={14} className={isOccupied ? 'text-rose-500' : 'text-slate-400'} />
                  <span className="text-xs font-black text-slate-700">{table.capacity} {t('seats')}</span>
                </div>

                {/* Doluluk Durumu Değiştirme Butonu */}
                <button
                  onClick={() => handleStatusToggle(table)}
                  className={`w-full py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer ${
                    isOccupied 
                      ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs' 
                      : 'bg-slate-100 hover:bg-slate-150 text-slate-700'
                  }`}
                >
                  {isOccupied ? t('occupied') : t('mark_occupied')}
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center">
          <Layers size={48} className="mx-auto text-slate-300 mb-4" />
          <h4 className="text-slate-800 font-bold">{t('no_seating_slots') || 'No Seating Slots Found'}</h4>
          <p className="text-xs text-slate-400 mt-1">{t('deploy_first_table')}</p>
        </div>
      )}

      {/* Masa Ekleme/Düzenleme Form Modali */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-sm overflow-hidden animate-zoom-in">
            <div className="px-6 py-4 bg-slate-900 text-white flex justify-between items-center">
              <h3 className="font-bold">{editingTable ? t('edit_table_config') : t('introduce_seating_slot')}</h3>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-white cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">{t('seating_label')}</label>
                <input
                  required
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-hidden font-semibold"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">{t('max_capacity')}</label>
                <input
                  required
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-hidden font-semibold"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">{t('section_area')}</label>
                <select
                  name="section"
                  value={formData.section}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-hidden font-bold cursor-pointer"
                >
                  <option value="Main Hall">{language === 'tr' ? 'Ana Salon' : 'Main Hall'}</option>
                  <option value="Garden Patio">{language === 'tr' ? 'Bahçe / Veranda' : 'Garden Patio'}</option>
                  <option value="VIP Saloon">{language === 'tr' ? 'VIP Salon' : 'VIP Saloon'}</option>
                  <option value="Bar Desk">{language === 'tr' ? 'Bar / Tezgah' : 'Bar Desk'}</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">{t('initial_occupancy')}</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-hidden font-bold cursor-pointer"
                >
                  <option value="Available">{language === 'tr' ? 'Boş / Müsait' : 'Available'}</option>
                  <option value="Occupied">{language === 'tr' ? 'Dolu' : 'Occupied'}</option>
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
                  {t('deploy_table_slot')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
