// React ve durum/etki kancalarını içe aktar
import React, { useEffect, useState } from 'react';
// Stok envanteri ekranı simgelerini Lucide React paketinden yükle
import { 
  Boxes, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  AlertTriangle, 
  X, 
  RotateCcw 
} from 'lucide-react';
// Redux stok verileri ve thunk eylemlerini yükle
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchInventory, 
  addInventoryItem, 
  updateInventoryItem, 
  deleteInventoryItem 
} from '../../features/inventory/inventorySlice.js';
// Çoklu dil kancasını içe aktar
import { useLanguage } from '../../context/LanguageContext.jsx';
// Bildirim ve özel onay modali kancasını içe aktar
import { useNotification } from '../../context/NotificationContext.jsx';

// Süper Admin Stok ve Depo Envanteri Yönetim Bileşeni
export default function InventoryManagement({ currentUser }) {
  const dispatch = useDispatch();
  const { t, language } = useLanguage();
  const { showToast, confirm } = useNotification();
  // Redux store'dan stok listesini oku
  const { items, loading, error } = useSelector((state) => state.inventory);

  // Arama, şube filtresi ve kritik stok uyarısı filtresi
  const [searchQuery, setSearchQuery] = useState('');
  const [branchFilter, setBranchFilter] = useState('All');
  const [alertFilter, setAlertFilter] = useState(false);

  // CRUD Form durum yönetimleri
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    quantity: 0,
    unit: 'kg',
    minLimit: 10,
    branchName: 'All Branches',
    supplier: ''
  });

  // Sayfa açıldığında stokları sunucudan çek
  useEffect(() => {
    dispatch(fetchInventory());
  }, [dispatch]);

  // Yeni Stok Ekleme Modalini Aç
  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      quantity: 0,
      unit: 'kg',
      minLimit: 10,
      branchName: 'All Branches',
      supplier: ''
    });
    setIsModalOpen(true);
  };

  // Stok Düzenleme Modalini Aç
  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      quantity: item.quantity,
      unit: item.unit,
      minLimit: item.minLimit,
      branchName: item.branchName || 'All Branches',
      supplier: item.supplier || ''
    });
    setIsModalOpen(true);
  };

  // Modali Kapat
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  // Form girdilerini izle
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: (name === 'quantity' || name === 'minLimit') ? Number(value) : value
    }));
  };

  // Formu Kaydet
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingItem) {
      dispatch(updateInventoryItem({ id: editingItem.id, ...formData }));
      showToast('Inventory item updated successfully!', 'success');
    } else {
      dispatch(addInventoryItem(formData));
      showToast('Inventory item added successfully!', 'success');
    }
    handleCloseModal();
  };

  // Stok Kaydını Sil
  const handleDelete = async (id) => {
    const isConfirmed = await confirm({
      title: language === 'tr' ? 'Stok Kaydını Sil' : 'Delete Inventory Item',
      message: language === 'tr' ? 'Bu stok kaydını kalıcı olarak silmek istediğinize emin misiniz?' : 'Delete this stock ledger line?',
      confirmText: language === 'tr' ? 'Sil' : 'Delete',
      cancelText: language === 'tr' ? 'İptal' : 'Cancel'
    });
    if (isConfirmed) {
      dispatch(deleteInventoryItem(id));
      showToast('Inventory item deleted successfully!', 'success');
    }
  };

  // Stok filtreleme mantığı
  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (item.supplier && item.supplier.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const branchNameToCheck = item.branchName || 'All Branches';
    const matchesBranch = branchFilter === 'All' || branchNameToCheck === branchFilter;
    const isAlertItem = item.quantity <= item.minLimit;
    const matchesAlert = !alertFilter || isAlertItem;

    return matchesSearch && matchesBranch && matchesAlert;
  });

  const uniqueBranches = ['All', ...new Set(items.map(i => i.branchName || 'All Branches').filter(Boolean))];

  return (
    <div id="inventory-panel" className="p-8 space-y-6 animate-fade-in">
      
      {/* Üst Başlık ve Stok Ekleme Butonu */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">{t('inventory_ledger')}</h2>
          <p className="text-xs text-slate-500 font-semibold">{t('track_key_ingredients')}</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4.5 py-2.5 rounded-xl cursor-pointer shadow-md transition-all duration-155"
        >
          <Plus size={14} /> {t('add_stock')}
        </button>
      </div>

      {/* Stok KPI Sayaç Kartları */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-2xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('total_tracked_items')}</p>
          <h4 className="text-2xl font-black text-slate-900 mt-1">{items.length}</h4>
        </div>
        <div className="bg-white p-5 border border-slate-200 rounded-2xl flex justify-between items-center shadow-2xs">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('critical_shortage_triggers')}</p>
            <h4 className="text-2xl font-black text-amber-600 mt-1">
              {items.filter(i => i.quantity <= i.minLimit).length}
            </h4>
          </div>
          <AlertTriangle className="text-amber-500 animate-pulse" size={24} />
        </div>
        <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-2xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('supply_depots_connected')}</p>
          <h4 className="text-2xl font-black text-slate-900 mt-1">{t('hq_regional_nodes')}</h4>
        </div>
      </div>

      {/* Kontrol Arama & Filtreleme Çubuğu */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-white p-4 border border-slate-200 rounded-2xl shadow-2xs">
        <div className="flex flex-wrap items-center gap-3">
          {/* Arama Girişi */}
          <div className="relative w-64">
            <Search size={14} className="absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder={t('search_stock_placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2.5 text-xs focus:outline-hidden"
            />
          </div>

          {/* Depo / Şube Konum Seçicisi */}
          <select
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold cursor-pointer"
          >
            {uniqueBranches.map(br => {
              const brTranslation = br === 'All' ? (language === 'tr' ? 'Tüm Depo Konumları' : 'All Locations') :
                                    br === 'All Branches' ? (language === 'tr' ? 'Tüm Şubeler' : 'All Branches') : br;
              return (
                <option key={br} value={br}>{brTranslation}</option>
              );
            })}
          </select>

          {/* Sadece Kritik Stok Filtre Butonu */}
          <button
            onClick={() => setAlertFilter(!alertFilter)}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold border transition-colors flex items-center gap-1.5 cursor-pointer ${
              alertFilter 
                ? 'bg-amber-100 border-amber-300 text-amber-800' 
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <AlertTriangle size={12} />
            <span>{t('show_low_stock_only')}</span>
          </button>
        </div>

        {/* Sıfırlama Butonu */}
        <button 
          onClick={() => { setSearchQuery(''); setBranchFilter('All'); setAlertFilter(false); }}
          className="text-slate-400 hover:text-blue-600 font-bold text-xs flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw size={12} /> {t('clear_console') || 'Reset'}
        </button>
      </div>

      {/* Stok Listesi Tablosu */}
      {filteredItems.length > 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="p-4">{t('stock_name')}</th>
                  <th className="p-4">{t('location') || 'Location'}</th>
                  <th className="p-4 text-center">{t('quantity')}</th>
                  <th className="p-4 text-center">{t('min_limit')}</th>
                  <th className="p-4">{t('supplier')}</th>
                  <th className="p-4 text-center">{t('actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.map(item => {
                  const isLow = item.quantity <= item.minLimit;
                  const locationTranslation = item.branchName === 'All Branches' ? (language === 'tr' ? 'Tüm Şubeler' : 'All Branches') : (item.branchName || (language === 'tr' ? 'Tüm Şubeler' : 'All Branches'));
                  const supplierTranslation = item.supplier || (language === 'tr' ? 'Merkez Standart Tedarikçi' : 'Standard HQ Supplier');

                  return (
                    <tr key={item.id} className={`hover:bg-slate-50/50 ${isLow ? 'bg-amber-50/20' : ''}`}>
                      <td className="p-4 font-bold text-slate-900 flex items-center gap-2">
                        {isLow && <AlertTriangle size={14} className="text-amber-500" title={language === 'tr' ? 'Kritik Stok Uyarısı' : 'Restock Required'} />}
                        <span>{item.name}</span>
                      </td>
                      <td className="p-4 font-semibold text-slate-600">{locationTranslation}</td>
                      <td className="p-4 text-center font-extrabold text-slate-800">
                        <span className={isLow ? 'text-amber-600 font-black' : ''}>
                          {item.quantity} {item.unit}
                        </span>
                      </td>
                      <td className="p-4 text-center font-bold text-slate-400">{item.minLimit} {item.unit}</td>
                      <td className="p-4 font-medium text-slate-500">{supplierTranslation}</td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenEditModal(item)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-50 rounded-lg cursor-pointer"
                            title={t('edit') || 'Edit'}
                          >
                            <Edit2 size={12} />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
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
          <Boxes size={48} className="mx-auto text-slate-300 mb-4" />
          <h4 className="text-slate-800 font-bold">{t('no_stock_items')}</h4>
          <p className="text-xs text-slate-400 mt-1">{t('no_stock_subtitle')}</p>
        </div>
      )}

      {/* Stok Ekleme/Düzenleme Form Modali */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-zoom-in">
            <div className="px-6 py-4 bg-slate-900 text-white flex justify-between items-center">
              <h3 className="font-bold">{editingItem ? t('edit_supply_listing') : t('add_stock')}</h3>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-white cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Malzeme Adı */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">{t('stock_name_required')}</label>
                <input
                  required
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-hidden"
                />
              </div>

              {/* Miktar & Birim */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">{t('quantity_required')}</label>
                  <input
                    required
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">{t('measurement_unit')}</label>
                  <input
                    required
                    type="text"
                    name="unit"
                    placeholder="e.g. kg, pieces, liters"
                    value={formData.unit}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Kritik Eşik & Şube Deposu */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">{t('min_limit_required')}</label>
                  <input
                    required
                    type="number"
                    name="minLimit"
                    value={formData.minLimit}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">{t('node_location')}</label>
                  <input
                    type="text"
                    name="branchName"
                    value={formData.branchName}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Tedarikçi Firma */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">{t('supplier')}</label>
                <input
                  type="text"
                  name="supplier"
                  value={formData.supplier}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-hidden"
                />
              </div>

              {/* Form Alt Butonları */}
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
                  {t('save_stock_item')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
