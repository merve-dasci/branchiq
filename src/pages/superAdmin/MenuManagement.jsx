// React ve durum kancasını (useState) içe aktar
import React, { useState } from 'react';
// Menü kataloğu ekranı simgelerini Lucide React paketinden yükle
import { 
  UtensilsCrossed, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  X, 
  SlidersHorizontal
} from 'lucide-react';
// Redux menü ekleme, güncelleme ve silme thunk eylemlerini import et
import { useDispatch } from 'react-redux';
import { addMenuItem, updateMenuItem, deleteMenuItem } from '../../features/menu/menuSlice.js';
// Çoklu dil kancasını içe aktar
import { useLanguage } from '../../context/LanguageContext.jsx';
// Bildirim ve özel onay modali kancasını içe aktar
import { useNotification } from '../../context/NotificationContext.jsx';

// Süper Admin Menü Yönetimi Bileşeni
export default function MenuManagement({ menuItems, currentUser }) {
  const dispatch = useDispatch();
  const { t, language } = useLanguage();
  const { showToast, confirm } = useNotification();

  // Arama filtresi ve kategori filtresi durum yönetimi
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Modal Açık/Kapalı ve güncellenen ürün durumları
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Yeni menü ürünü formu veri yapısı
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    category: 'Main Dish',
    description: '',
    isAvailable: true
  });

  // Kategori listesi tanımı
  const categories = ['All', 'Starter', 'Main Dish', 'Dessert', 'Beverage'];

  // Menü ürünlerini arama sorgusu ve kategoriye göre süz
  const filteredItems = menuItems.filter(item => {
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Yeni Ürün Ekleme Modalini Aç
  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      price: 0,
      category: 'Main Dish',
      description: '',
      isAvailable: true
    });
    setIsModalOpen(true);
  };

  // Ürün Düzenleme Modalini Aç
  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      price: item.price,
      category: item.category,
      description: item.description,
      isAvailable: item.isAvailable
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
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (name === 'price' ? Number(value) : value)
    }));
  };

  // Formu Gönder (Ekle veya Güncelle)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingItem) {
      dispatch(updateMenuItem({ id: editingItem.id, ...formData }));
      showToast('Menu item updated successfully!', 'success');
    } else {
      dispatch(addMenuItem(formData));
      showToast('Menu item created successfully!', 'success');
    }
    handleCloseModal();
  };

  // Ürünü Kalıcı Olarak Sil
  const handleDelete = async (id) => {
    const isConfirmed = await confirm({
      title: language === 'tr' ? 'Menü Ürününü Sil' : 'Delete Menu Item',
      message: language === 'tr' ? 'Bu menü ürününü sistemden kalıcı olarak silmek istediğinize emin misiniz?' : 'Are you sure you want to permanently delete this menu item?',
      confirmText: language === 'tr' ? 'Sil' : 'Delete',
      cancelText: language === 'tr' ? 'İptal' : 'Cancel'
    });
    if (isConfirmed) {
      dispatch(deleteMenuItem(id));
      showToast('Menu item deleted successfully!', 'success');
    }
  };

  // Ürünün Stok Durumunu Tersine Çevir (Stokta Var / Yok)
  const toggleAvailability = (item) => {
    dispatch(updateMenuItem({
      ...item,
      isAvailable: !item.isAvailable
    }));
  };

  return (
    <div id="menu-panel" className="p-8 space-y-6 animate-fade-in">

      {/* Kontrol Arama & Filtre Satırı */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-white p-4 border border-slate-200 rounded-2xl shadow-xs">
        <div className="flex flex-1 items-center gap-3">
          {/* Arama Barı */}
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
            <input
              id="menu-search-input"
              type="text"
              placeholder={t('search_menu_placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Kategori Seçici Filtre */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 p-2 rounded-xl text-xs">
            <SlidersHorizontal size={14} className="text-slate-500" />
            <select
              id="menu-category-filter"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-transparent border-none font-semibold text-slate-700 cursor-pointer focus:outline-hidden"
            >
              {categories.map(cat => {
                const catTranslation = cat === 'All' ? (language === 'tr' ? 'Tüm Kategoriler' : 'All Categories') :
                                       cat === 'Starter' ? (language === 'tr' ? 'Başlangıç' : 'Starter') :
                                       cat === 'Main Dish' ? (language === 'tr' ? 'Ana Yemek' : 'Main Dish') :
                                       cat === 'Dessert' ? (language === 'tr' ? 'Tatlı' : 'Dessert') :
                                       (language === 'tr' ? 'İçecek' : 'Beverage');

                return (
                  <option key={cat} value={cat}>{catTranslation}</option>
                );
              })}
            </select>
          </div>
        </div>

        {/* Yeni Menü Ürünü Ekleme Butonu */}
        {currentUser && (currentUser.role === 'Super Admin' || currentUser.role === 'superAdmin' || currentUser.role === 'Regional Manager') && (
          <button
            id="add-menu-item-btn"
            onClick={handleOpenAddModal}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-lg shadow-blue-500/10 transition-all cursor-pointer"
          >
            <Plus size={16} />
            <span>{t('publish_dish')}</span>
          </button>
        )}
      </div>

      {/* Menü Kartları Bento Listesi */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredItems.map(item => {
            const catTranslation = item.category === 'Starter' ? (language === 'tr' ? 'BAŞLANGIÇ' : 'Starter') :
                                   item.category === 'Main Dish' ? (language === 'tr' ? 'ANA YEMEK' : 'Main Dish') :
                                   item.category === 'Dessert' ? (language === 'tr' ? 'TATLI' : 'Dessert') :
                                   (language === 'tr' ? 'İÇECEK' : 'Beverage');

            return (
              <div 
                key={item.id} 
                id={`menu-item-card-${item.id}`}
                className={`bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col ${
                  !item.isAvailable ? 'opacity-70 bg-slate-50/50' : ''
                }`}
              >
                <div className="p-6 pb-4 flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md">
                      {catTranslation}
                    </span>
                    
                    {/* Stok Durumu Toggle Düğmesi */}
                    <button
                      onClick={() => toggleAvailability(item)}
                      id={`menu-item-toggle-${item.id}`}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                        item.isAvailable 
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' 
                          : 'bg-slate-150 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      {item.isAvailable ? t('in_stock') : t('out_of_stock')}
                    </button>
                  </div>

                  <div className="flex justify-between items-baseline mb-2">
                    <h4 className="font-bold text-slate-900 tracking-tight text-sm sm:text-base">{item.name}</h4>
                    <span className="text-sm font-black text-slate-900">${item.price}</span>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed font-medium">{item.description}</p>
                </div>

                {/* Düzenleme & Silme İşlem Butonları */}
                {currentUser && (currentUser.role === 'Super Admin' || currentUser.role === 'superAdmin' || currentUser.role === 'Regional Manager') && (
                  <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-100 flex justify-end gap-3.5">
                    <button
                      id={`menu-item-edit-btn-${item.id}`}
                      onClick={() => handleOpenEditModal(item)}
                      className="flex items-center gap-1.5 text-xs text-slate-650 hover:text-blue-600 font-bold transition-all cursor-pointer"
                    >
                      <Edit2 size={12} />
                      <span>{t('edit') || 'Edit'}</span>
                    </button>
                    <button
                      id={`menu-item-delete-btn-${item.id}`}
                      onClick={() => handleDelete(item.id)}
                      className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 font-bold transition-all cursor-pointer"
                    >
                      <Trash2 size={12} />
                      <span>{t('delete') || 'Delete'}</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center shadow-xs">
          <UtensilsCrossed size={48} className="mx-auto text-slate-300 mb-4" />
          <h4 className="text-slate-800 font-bold">{t('no_menu_items')}</h4>
          <p className="text-xs text-slate-400 mt-1">{t('no_menu_subtitle')}</p>
        </div>
      )}

      {/* Menü Ekleme/Düzenleme Form Modali */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-zoom-in">
            <div className="px-6 py-4 bg-slate-900 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <UtensilsCrossed size={18} className="text-blue-400" />
                <h3 className="font-bold">{editingItem ? t('edit_culinary_listing') : t('add_dish')}</h3>
              </div>
              <button 
                id="close-menu-modal-btn"
                onClick={handleCloseModal} 
                className="text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Ürün Adı */}
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">{t('culinary_name_required')}</label>
                <input
                  required
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Traditional Iskender Kebab"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {/* Kategori & Fiyat */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">{t('category_required')}</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-bold focus:outline-hidden cursor-pointer"
                  >
                    <option value="Starter">{language === 'tr' ? 'Başlangıç' : 'Starter'}</option>
                    <option value="Main Dish">{language === 'tr' ? 'Ana Yemek' : 'Main Dish'}</option>
                    <option value="Dessert">{language === 'tr' ? 'Tatlı' : 'Dessert'}</option>
                    <option value="Beverage">{language === 'tr' ? 'İçecek' : 'Beverage'}</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">{t('price_required')}</label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              {/* Açıklama */}
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">{t('description_required')}</label>
                <textarea
                  required
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Summarize cooking methods, ingredients, dietary details..."
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {/* Stok Durum Kutusu */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  name="isAvailable"
                  id="form-is-available"
                  checked={formData.isAvailable}
                  onChange={handleInputChange}
                  className="rounded-xs border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="form-is-available" className="text-xs font-bold text-slate-650 cursor-pointer">
                  {t('activate_availability')}
                </label>
              </div>

              {/* Form Alt Butonları */}
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm px-4 py-2.5 rounded-xl transition-all cursor-pointer"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  id="submit-menu-form-btn"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-all cursor-pointer"
                >
                  {editingItem ? t('save_updates') : t('publish_dish')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
